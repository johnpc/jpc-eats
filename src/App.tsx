import {
  Heading,
  Image,
  View,
  useTheme,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { App as CapacitorApp } from "@capacitor/app";

import { useEffect, useState } from "react";
import {
  ChoiceEntity,
  PreferencesEntity,
  RotationEntity,
  createChoiceListener,
  createPreferencesListener,
  createRotationListener,
  deleteRotationListener,
  getPreferences,
  listChoice,
  listRotation,
  unsubscribeListener,
  updateChoiceListener,
  updatePreferencesListener,
} from "./entities";
import { AuthUser } from "aws-amplify/auth";
import TabsView from "./components/TabsView";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";


function App(props: { user: AuthUser }) {
  const [lastOpenTime, setLastOpenTime] = useState<Date>();
  const [preferences, setPreferences] = useState<PreferencesEntity>(localStorage.getItem("preferences") ? JSON.parse(localStorage.getItem("preferences")!) : {});
  const [rotation, setRotation] = useState<RotationEntity[]>(localStorage.getItem("rotation") ? JSON.parse(localStorage.getItem("rotation")!) : []);
  const [choices, setChoices] = useState<ChoiceEntity[]>(localStorage.getItem("choices") ? JSON.parse(localStorage.getItem("choices")!) : []);
  const [youAreHere, setYouAreHere] = useState<{
    latitude: number;
    longitude: number;
  }>(
    localStorage.getItem("coordinates") ? JSON.parse(localStorage.getItem("coordinates")!)
    : {
    // Default to ann arbor
    latitude: 42.280827,
    longitude: -83.743034,
  });

  console.log({youAreHere});

  useEffect(() => {
    CapacitorApp.addListener("resume", () => {
      setLastOpenTime(new Date());
    });
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    const createRotationSubscription = createRotationListener(
      async (rotationItem: RotationEntity) => {
        const newRotation = [...rotation, rotationItem];
        setRotation(newRotation);
      },
    );
    const createChoiceSubscription = createChoiceListener(
      async (choiceItem: ChoiceEntity) => {
        const newChoices = [...choices, choiceItem];
        setChoices(newChoices);
      },
    );
    const updateChoiceSubscription = updateChoiceListener(
      async (choiceItem: ChoiceEntity) => {
        const newChoices = choices.map((choice) =>
          choice.id === choiceItem.id ? choiceItem : choice,
        );
        setChoices(newChoices);
      },
    );
    const deleteRotationSubscription = deleteRotationListener(
      async (rotationItem: RotationEntity) => {
        const newRotation = rotation.filter((r) => r.id !== rotationItem.id);
        setRotation(newRotation);
      },
    );
    const createPreferencesSubscription = createPreferencesListener(
      async (preferences: PreferencesEntity) => {
        setPreferences({ ...preferences, compactMode: true });
      },
    );
    const updatePreferencesSubscription = updatePreferencesListener(
      async (preferences: PreferencesEntity) => {
        setPreferences({ ...preferences, compactMode: true });
      },
    );
    return () => {
      unsubscribeListener(createRotationSubscription);
      unsubscribeListener(createChoiceSubscription);
      unsubscribeListener(updateChoiceSubscription);
      unsubscribeListener(deleteRotationSubscription);
      unsubscribeListener(createPreferencesSubscription);
      unsubscribeListener(updatePreferencesSubscription);
    };
  }, [choices, rotation, lastOpenTime]);

  useEffect(() => {
    const setup = async () => {
      const fetchGeolocation = async () => {
        let coordinates: Position | undefined;
        try {
          coordinates = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            maximumAge: 300000,
            timeout: 5000,
          });
        } catch {
          coordinates = {
            timestamp: Date.now(),
            coords: {
              // Ann Arbor
              latitude: 42.280827,
              longitude: -83.743034,
              accuracy: 0,

              altitudeAccuracy: null,
              altitude: null,
              speed: null,
              heading: null,
            },
          };
        }

        console.log({ coordinates });
        localStorage.setItem("coordinates", JSON.stringify(coordinates))
        setYouAreHere({
          latitude: coordinates!.coords.latitude,
          longitude: coordinates!.coords.longitude,
        });
      };

      const fetchChoices = async () => {
        const choices = await listChoice();
        localStorage.setItem("choices", JSON.stringify(choices))
        setChoices(choices);
      };

      const fetchPreferences = async () => {
        const preferences = await getPreferences();
        localStorage.setItem("preferences", JSON.stringify(preferences))
        setPreferences({ ...preferences, compactMode: true });
      };

      const fetchRotation = async () => {
        const rotation = await listRotation();
        localStorage.setItem("rotation", JSON.stringify(rotation))
        setRotation(rotation);
      };
      await Promise.all([
        fetchChoices(),
        fetchRotation(),
        fetchGeolocation(),
        fetchPreferences(),
      ]);
    };
    setup();
  }, []);

  return (
    <>
      <Header />
      <TabsView
        user={props.user}
        youAreHere={youAreHere}
        rotation={rotation}
        choices={choices}
        preferences={preferences}
      />
      <Footer />
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuthenticator(App, {
  components: {
    Header() {
      const { tokens } = useTheme();
      return (
        <View textAlign="center" backgroundColor={"#F5DEB3"} padding={"15px"}>
          <Image
            alt="logo"
            borderRadius={tokens.radii.xl}
            width={"100px"}
            src="/maskable.png"
          />
          <Heading
            fontSize={tokens.fontSizes.xl}
            color={tokens.colors.primary[90]}
          >
            jpc.eats
          </Heading>
        </View>
      );
    },
  },
});
