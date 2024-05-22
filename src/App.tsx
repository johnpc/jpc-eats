import {
  Heading,
  Image,
  View,
  useTheme,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Geolocation } from "@capacitor/geolocation";
import { App as CapacitorApp } from "@capacitor/app";

import { useEffect, useState } from "react";
import config from "../amplify_outputs.json";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
  RotationEntity,
  createChoiceListener,
  createRotationListener,
  deleteRotationListener,
  listChoice,
  listRotation,
  unsubscribeListener,
  updateChoiceListener,
} from "./entities";
import { AuthUser } from "aws-amplify/auth";
import TabsView from "./components/TabsView";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App(props: { user: AuthUser }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [lastOpenTime, setLastOpenTime] = useState<Date>();
  const [places, setPlaces] = useState<Place[]>([]);
  const [placesV1, setPlacesV1] = useState<PlaceV1[]>([]);
  const [rotation, setRotation] = useState<RotationEntity[]>([]);
  const [choices, setChoices] = useState<ChoiceEntity[]>([]);
  const [youAreHere, setYouAreHere] = useState<{
    latitude: number;
    longitude: number;
  }>();

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

    return () => {
      unsubscribeListener(createRotationSubscription);
      unsubscribeListener(createChoiceSubscription);
      unsubscribeListener(updateChoiceSubscription);
      unsubscribeListener(deleteRotationSubscription);
    };
  }, [choices, rotation, lastOpenTime]);

  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 5000,
      });
      // Ann Arbor
      // const coordinates = {
      //   coords: {
      //     latitude: 42.280827,
      //     longitude: -83.743034,
      //   },
      // };
      console.log({ coordinates });
      setYouAreHere({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      });

      const response = await fetch(config.custom.listPlacesFunction, {
        body: JSON.stringify({
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        }),
        method: "POST",
      });

      const json = await response.json();
      setPlaces(
        json.places.filter(
          (place: Place) => place.primaryType === "restaurant",
        ),
      );
      console.log({ json });

      const responseV1 = await fetch(config.custom.listAllPlacesFunction, {
        body: JSON.stringify({
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        }),
        method: "POST",
      });

      const jsonV1 = await responseV1.json();
      setPlacesV1(jsonV1.results);
      console.log({ jsonV1 });

      const choices = await listChoice();
      setChoices(choices);
      const rotation = await listRotation();
      setRotation(rotation);
      setLoading(false);
    };
    setup();
  }, []);

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
