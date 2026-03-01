import { Collection, useTheme } from "@aws-amplify/ui-react";
import { PlaceCard, PlaceCardProps } from "./PlaceCard";

interface PlacesListProps {
  places: PlaceCardProps["place"][];
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
