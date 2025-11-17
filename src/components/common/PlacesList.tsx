import { Collection, useTheme } from "@aws-amplify/ui-react";
import { PlaceCard } from "./PlaceCard";

interface PlacesListProps {
  places: any[];
}

export function PlacesList({ places }: PlacesListProps) {
  const { tokens } = useTheme();

  if (places.length === 0) return null;

  return (
    <Collection
      items={places}
      type="list"
      direction="column"
      gap="medium"
      marginBottom={tokens.space.medium}
    >
      {(place) => <PlaceCard key={place.id} place={place} />}
    </Collection>
  );
}
