import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
  PreferencesEntity,
  RotationEntity,
} from "../entities";
import { Collection, Heading, Message, useTheme } from "@aws-amplify/ui-react";
import { PlaceCard } from "./PlaceListPage/PlaceCard";
import { useEffect, useState } from "react";
import config from "../../amplify_outputs.json";

export const RotationPage = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const { tokens } = useTheme();
  const [rotationPlaces, setRotationPlaces] = useState<Place[]>([]);
  const rotationIds = props.rotation.map((r) => r.googlePlaceId);
  useEffect(() => {
    const setup = async () => {
      const promises = rotationIds.map(async (id) => {
        const response = await fetch(
          `${config.custom.getPlaceFunction}?placeId=${id}`,
        );
        const json = await response.json();
        console.log({ json });
        return json;
      });
      const places = await Promise.all(promises);
      console.log({ places });
      setRotationPlaces(places);
    };
    if (rotationIds.length !== rotationPlaces.length) {
      setup();
    }
  }, [rotationIds]);
  const uniqueNames: string[] = [];
  const uniquePlaces: Place[] = rotationPlaces.filter((place: Place) => {
    if (uniqueNames.includes(place.name)) {
      return false;
    }
    uniqueNames.push(place.name);
    return true;
  });
  uniquePlaces.sort(function (a: Place, b: Place) {
    if (a.displayName.text < b.displayName.text) {
      return -1;
    }
    if (a.displayName.text > b.displayName.text) {
      return 1;
    }
    return 0;
  });

  console.log({ uniquePlaces });

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>
        Restaurants in your rotation
      </Heading>
      <Collection
        items={uniquePlaces}
        type="list"
        direction="column"
        gap="medium"
        marginBottom={tokens.space.medium}
        searchNoResultsFound={
          <Message
            variation="outlined"
            colorTheme="warning"
            marginBottom={tokens.space.medium}
            heading="No places found"
          >
            No restaurants in your rotation were found near you.
          </Message>
        }
      >
        {(item) => (
          <PlaceCard
            key={item.id}
            place={item}
            rotation={props.rotation}
            choices={props.choices}
            preferences={props.preferences}
          />
        )}
      </Collection>
    </>
  );
};
