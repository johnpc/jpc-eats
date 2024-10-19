import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
} from "../../entities";
import { Collection, Heading, Message, useTheme } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { PlaceCard } from "../PlaceListPage/PlaceCard";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
const client = generateClient<Schema>();

export const CurrentOptions = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const { tokens } = useTheme();
  const [choicePlaces, setChoicePlaces] = useState<Place[]>([]);
  useEffect(() => {
    const currentChoice = props.choices.find(
      (c) => c.selectedPlaceId === "NONE",
    );
    console.log({ currentChoice });
    const setup = async () => {
      const promises =
        currentChoice?.optionPlaceIds.map(async (id) => {
          const response = await client.queries.getGooglePlace({
            placeId: id!,
          });
          return response.data;
        }) ?? [];
      const optionPlaces = await Promise.all(promises);
      console.log({ optionPlaces });
      setChoicePlaces(optionPlaces as unknown as Place[]);
    };
    if (currentChoice?.optionPlaceIds.length !== choicePlaces.length) {
      setup();
    }
  }, [props.choices]);

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Nominated Restaurants</Heading>
      <Collection
        items={choicePlaces}
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
            No nominated restaurants were found near you.
          </Message>
        }
      >
        {(item: Place) => (
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
