import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../../entities";
import { Collection, Heading, Message, useTheme } from "@aws-amplify/ui-react";
import { PlaceV1Card } from "../PlaceListPage/PlaceV1Card";

export const CurrentOptions = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
}) => {
  const { tokens } = useTheme();
  const currentChoice = props.choices.find((c) => c.selectedPlaceId === "NONE");
  const choicePlaces = props.placesV1.filter((place) =>
    (currentChoice?.optionPlaceIds ?? []).includes(place.place_id),
  );
  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Nearby Restaurants</Heading>
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
          <PlaceV1Card
            key={item.place_id}
            place={item}
            rotation={props.rotation}
            choices={props.choices}
          />
        )}
      </Collection>
    </>
  );
};
