import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
  listChoice,
  registerRefreshCallback,
} from "../../entities";
import {
  Collection,
  Heading,
  Message,
  Button,
  useTheme,
} from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { PlaceCard } from "../PlaceListPage/PlaceCard";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import RefreshIcon from "@mui/icons-material/Refresh";
const client = generateClient<Schema>();

export const CurrentOptions = (props: {
  user: AuthUser | null;
  youAreHere?: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const { tokens } = useTheme();
  const [choicePlaces, setChoicePlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  // Force refresh when choices change
  useEffect(() => {
    console.log("Choices changed, refreshing options...");
    fetchOptionPlaces();
  }, [props.choices, lastRefreshTime]);

  // Register for global refresh events
  useEffect(() => {
    const unregister = registerRefreshCallback(() => {
      console.log("Global refresh triggered for CurrentOptions");
      setLastRefreshTime(new Date()); // This will trigger a re-fetch
    });

    return () => unregister();
  }, []);

  const fetchOptionPlaces = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching option places...");

      // Get the latest choices directly from the database
      const latestChoices = await listChoice();
      console.log("Latest choices from database:", latestChoices);

      const currentChoice = latestChoices.find(
        (c) => c.selectedPlaceId === "NONE",
      );

      console.log("Current choice for options:", currentChoice);

      if (
        !currentChoice ||
        !currentChoice.optionPlaceIds ||
        currentChoice.optionPlaceIds.length === 0
      ) {
        console.log("No current choices found or empty options");
        setChoicePlaces([]);
        return;
      }

      // Get unique place IDs to prevent duplicates
      const uniquePlaceIds = Array.from(
        new Set(currentChoice.optionPlaceIds.filter((id) => id !== null)),
      );
      console.log("Unique place IDs to fetch:", uniquePlaceIds);

      const promises = uniquePlaceIds.map(async (id) => {
        try {
          console.log("Fetching place details for:", id);
          const response = await client.queries.getGooglePlace({
            placeId: id!,
          });
          console.log("Place details received for", id, ":", response.data);
          return response.data;
        } catch (error) {
          console.error("Error fetching place details for", id, ":", error);
          return null;
        }
      });

      const optionPlaces = await Promise.all(promises);
      console.log("All fetched option places:", optionPlaces);

      // Filter out any undefined or null results and ensure uniqueness by ID
      const uniqueOptionPlaces = optionPlaces
        .filter((place) => place !== undefined && place !== null)
        .reduce((acc: Place[], place: any) => {
          if (!acc.some((p) => p.id === place.id)) {
            acc.push(place as unknown as Place);
          }
          return acc;
        }, []);

      console.log("Final unique option places:", uniqueOptionPlaces);
      setChoicePlaces(uniqueOptionPlaces);
    } catch (error) {
      console.error("Error fetching option places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = () => {
    console.log("Manual refresh requested");
    setLastRefreshTime(new Date());
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading marginBottom={tokens.space.xs}>Nominated Restaurants</Heading>
        <Button
          onClick={handleManualRefresh}
          isLoading={isLoading}
          loadingText="Refreshing..."
          size="small"
          variation="link"
        >
          <RefreshIcon /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <Message variation="outlined">Loading options...</Message>
      ) : (
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
              No nominated restaurants were found. Try adding some from the
              Search tab.
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
      )}
    </>
  );
};
