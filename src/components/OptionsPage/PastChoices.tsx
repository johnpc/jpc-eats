import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../../entities";
import { useEffect, useState } from "react";
import config from "../../../amplify_outputs.json";

export const PastChoices = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
}) => {
  const pastChoices = props.choices.filter((c) => c.selectedPlaceId !== "NONE");
  const selectedOptions = pastChoices.map((choice) => choice.selectedPlaceId);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  useEffect(() => {
    const setup = async () => {
      const promises =
        selectedOptions.map(async (id) => {
          const response = await fetch(
            `${config.custom.getPlaceFunction}?placeId=${id}`,
          );
          const json = await response.json();
          console.log({ json });
          return json;
        }) ?? [];
      const selectedPlaces = await Promise.all(promises);
      console.log({ selectedPlaces });
      setSelectedPlaces(selectedPlaces);
    };
    if (selectedOptions.length !== selectedPlaces.length) {
      setup();
    }
  }, [props.choices]);

  return (
    <>
      {selectedPlaces.map((selectedPlace) => {
        return (
          <li key={selectedPlace.id}>
            Selected {selectedPlace?.displayName.text}
          </li>
        );
      })}
    </>
  );
};
