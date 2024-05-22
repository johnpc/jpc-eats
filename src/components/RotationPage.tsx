import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../entities";
import { Collection, Heading, Message, useTheme } from "@aws-amplify/ui-react";
import { PlaceV1Card } from "./PlaceListPage/PlaceV1Card";

export const RotationPage = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
}) => {
  const { tokens } = useTheme();
  const rotationIds = props.rotation.map((r) => r.googlePlaceId);
  const rotationPlaces = props.placesV1.filter((place) =>
    rotationIds.includes(place.place_id),
  );

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>
        Restaurants in your rotation
      </Heading>
      <Collection
        items={rotationPlaces}
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
