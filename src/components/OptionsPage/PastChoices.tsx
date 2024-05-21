import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../../entities";

export const PastChoices = (props: {
  user: AuthUser;
  youAreHere: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
}) => {
  const pastChoices = props.choices.filter((c) => c.selectedPlaceId !== "NONE");

  return (
    <>
      {pastChoices.map((choice) => {
        const selectedPlace = props.placesV1.find(
          (place) => choice?.selectedPlaceId === place.place_id,
        );
        return <li key={choice.id}>Selected {selectedPlace?.name}</li>;
      })}
    </>
  );
};
