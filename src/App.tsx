import {
  Heading,
  Image,
  Loader,
  View,
  useTheme,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { App as CapacitorApp } from "@capacitor/app";

import { useEffect, useState } from "react";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
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
  const [loading, setLoading] = useState<boolean>(true);
  const [lastOpenTime, setLastOpenTime] = useState<Date>();
  const [places] = useState<Place[]>([]);
  const [preferences, setPreferences] = useState<PreferencesEntity>({});
  const [placesV1] = useState<PlaceV1[]>([]);
  const [rotation, setRotation] = useState<RotationEntity[]>([]);
  const [choices, setChoices] = useState<ChoiceEntity[]>([]);
  const [youAreHere, setYouAreHere] = useState<{
    latitude: number;
    longitude: number;
  }>({
    // Default to ann arbor
    latitude: 42.280827,
    longitude: -83.743034,
  });

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
        setPreferences(preferences);
      },
    );
    const updatePreferencesSubscription = updatePreferencesListener(
      async (preferences: PreferencesEntity) => {
        setPreferences(preferences);
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
      setLoading(true);

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
        setYouAreHere({
          latitude: coordinates!.coords.latitude,
          longitude: coordinates!.coords.longitude,
        });
      };

      const fetchChoices = async () => {
        const choices = await listChoice();
        setChoices(choices);
      };

      const fetchPreferences = async () => {
        const preferences = await getPreferences();
        setPreferences(preferences);
      };

      const fetchRotation = async () => {
        const rotation = await listRotation();
        setRotation(rotation);
      };
      await Promise.all([
        fetchChoices(),
        fetchRotation(),
        fetchGeolocation(),
        fetchPreferences(),
      ]);
      setLoading(false);
    };
    setup();
  }, []);

  if (loading) return <Loader variation="linear" />;

  return (
    <>
      <Header />
      <TabsView
        user={props.user}
        youAreHere={youAreHere}
        places={places}
        rotation={rotation}
        choices={choices}
        placesV1={placesV1}
        loading={loading}
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
