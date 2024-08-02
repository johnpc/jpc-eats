import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
  PreferencesEntity,
  RotationEntity,
} from "../entities";
import {
  Collection,
  Heading,
  Loader,
  Message,
  useTheme,
} from "@aws-amplify/ui-react";
import { PlaceV1Card } from "./PlaceListPage/PlaceV1Card";

export const PlaceListPage = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
  loading: boolean;
}) => {
  const { tokens } = useTheme();
  console.log({ plac: props.placesV1 });
  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Nearby Restaurants</Heading>
      <Collection
        items={props.placesV1}
        type="list"
        direction="column"
        gap="medium"
        marginBottom={tokens.space.medium}
        searchNoResultsFound={
          <Message
            variation="outlined"
            colorTheme={props.loading ? "info" : "warning"}
            marginBottom={tokens.space.medium}
            heading={props.loading ? "Loading..." : "No places found"}
          >
            {props.loading ? (
              <Loader variation="linear" />
            ) : (
              "No restaurants near you were found. Reach out to support for more information."
            )}
          </Message>
        }
      >
        {(item) => (
          <PlaceV1Card
            key={item.place_id}
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
