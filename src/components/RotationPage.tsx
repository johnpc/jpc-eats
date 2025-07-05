import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
  registerRefreshCallback,
} from "../entities";
import { Collection, Heading, Message, useTheme } from "@aws-amplify/ui-react";
import { PlaceCard } from "./PlaceListPage/PlaceCard";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
const client = generateClient<Schema>();

export const RotationPage = (props: {
  user: AuthUser | null;
  youAreHere?: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const { tokens } = useTheme();
  const [rotationPlaces, setRotationPlaces] = useState<Place[]>([]);
  const rotationIds = props.rotation.map((r) => r.googlePlaceId);
  // const uniqueRotationIds = Array.from(new Set(rotationIds));

  // Force refresh when rotation changes
  useEffect(() => {
    console.log("Rotation changed, refreshing places...");
    fetchRotationPlaces();
  }, [props.rotation]);

  // Register for global refresh events
  useEffect(() => {
    const unregister = registerRefreshCallback(() => {
      console.log("Global refresh triggered for RotationPage");
      fetchRotationPlaces();
    });

    return () => unregister();
  }, []);

  const fetchRotationPlaces = async () => {
    try {
      console.log("Fetching rotation places...");
      // Get unique place IDs to prevent duplicates
      const uniqueIds = Array.from(new Set(rotationIds));

      if (uniqueIds.length === 0) {
        setRotationPlaces([]);
        return;
      }

      const promises = uniqueIds.map(async (id) => {
        const response = await client.queries.getGooglePlace({
          placeId: id,
        });
        return response.data!;
      });

      const places = await Promise.all(promises);
      console.log("Fetched rotation places:", places);

      // Filter out any undefined results and ensure uniqueness by ID
      const uniquePlaces = places
        .filter((place) => place !== undefined)
        .reduce((acc: any[], place: any) => {
          if (!acc.some((p) => p.id === place.id)) {
            acc.push(place as unknown as Place);
          }
          return acc;
        }, [] as Place[]);

      setRotationPlaces(uniquePlaces);
    } catch (error) {
      console.error("Error fetching rotation places:", error);
    }
  };

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

  console.log("Rendering rotation places:", uniquePlaces);

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
