import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
} from "../../entities";
import { useEffect, useState } from "react";
import { Card, Text } from "@aws-amplify/ui-react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
const client = generateClient<Schema>();

export const PastChoices = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const pastChoices = props.choices.filter((c) => c.selectedPlaceId !== "NONE");
  const selectedOptions = pastChoices.map((choice) => choice.selectedPlaceId);
  const [selectedPlaces, setSelectedPlaces] = useState<
    { selected: Place; options: Place[]; choice: ChoiceEntity }[]
  >([]);
  useEffect(() => {
    const getPlaceJson = async (id: string): Promise<Place> => {
      const response = await client.queries.getGooglePlace({
        placeId: id,
      });
      return response.data as unknown as Place;
    };

    const setup = async () => {
      const promises =
        pastChoices
          .filter((pastChoice) => pastChoice.selectedPlaceId)
          .map(async (pastChoice) => {
            const allOptionsPromises = pastChoice.optionPlaceIds.map((id) =>
              getPlaceJson(id!),
            );
            return {
              selected: await getPlaceJson(pastChoice.selectedPlaceId!),
              options: await Promise.all(allOptionsPromises),
              choice: pastChoice,
            };
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
      {selectedPlaces
        .sort(
          (a, b) =>
            new Date(b.choice.updatedAt!).getTime() -
            new Date(a.choice.updatedAt!).getTime(),
        )
        .map((selectedPlace, index) => {
          return (
            <Card key={`${selectedPlace.selected.id}-${index}`}>
              <Text>
                Selected{" "}
                <span style={{ fontWeight: "bold" }}>
                  {selectedPlace?.selected?.displayName.text}
                </span>{" "}
                on{" "}
                {new Date(selectedPlace.choice.updatedAt!).toLocaleDateString()}
              </Text>
              {selectedPlace.options.map((option, idx) => {
                return (
                  <li key={`${option?.id}-${index}-${idx}`}>
                    {option?.displayName?.text}
                  </li>
                );
              })}
            </Card>
          );
        })}
    </>
  );
};
