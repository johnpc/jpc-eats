import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../../entities";
import { Collection, Heading, Message, useTheme } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import config from "../../../amplify_outputs.json";
import { PlaceCard } from "../PlaceListPage/PlaceCard";

export const CurrentOptions = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
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
          const response = await fetch(
            `${config.custom.getPlaceFunction}?placeId=${id}`,
          );
          const json = await response.json();
          console.log({ json });
          return json;
        }) ?? [];
      const optionPlaces = await Promise.all(promises);
      console.log({ optionPlaces });
      setChoicePlaces(optionPlaces);
    };
    if (currentChoice?.optionPlaceIds.length !== choicePlaces.length) {
      setup();
    }
  }, [props.choices, choicePlaces.length]);

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
        {(item) => (
          <PlaceCard
            key={item.id}
            place={item}
            rotation={props.rotation}
            choices={props.choices}
          />
        )}
      </Collection>
    </>
  );
};
