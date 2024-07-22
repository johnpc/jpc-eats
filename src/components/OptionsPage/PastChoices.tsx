import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../../entities";
import { useEffect, useState } from "react";
import config from "../../../amplify_outputs.json";
import { Card, Text } from "@aws-amplify/ui-react";

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
  const [selectedPlaces, setSelectedPlaces] = useState<{selected: Place, options: Place[], choice: ChoiceEntity}[]>([]);
  useEffect(() => {
    const getPlaceJson = async (id: string) => {
      const response = await fetch(
        `${config.custom.getPlaceFunction}?placeId=${id}`,
      );
      const json = await response.json();
      console.log({ json });
      return json;
    }

    const setup = async () => {
      const promises =
        pastChoices.filter(pastChoice => pastChoice.selectedPlaceId).map(async (pastChoice) => {
          const allOptionsPromises = pastChoice.optionPlaceIds.map(id => getPlaceJson(id!));
          return {selected: await getPlaceJson(pastChoice.selectedPlaceId!), options: await Promise.all(allOptionsPromises), choice: pastChoice};
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
      {selectedPlaces.sort((a, b) => new Date(b.choice.updatedAt!).getTime() - new Date(a.choice.updatedAt!).getTime()).map((selectedPlace) => {
        return (
          <Card key={selectedPlace.selected.id}>
            <Text>Selected <span style={{fontWeight: 'bold'}}>{selectedPlace?.selected.displayName.text}</span> on {new Date(selectedPlace.choice.updatedAt!).toLocaleDateString()}</Text>
            {selectedPlace.options.map(option => <li>{option.displayName.text}</li>)}
          </Card>
        );
      })}
    </>
  );
};
