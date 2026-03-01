import { Button, Loader } from "@aws-amplify/ui-react";
import { usePlace } from "../../hooks/usePlace";
import { PlaceCard } from "../common/PlaceCard";

interface OptionPlaceCardProps {
  placeId: string;
  onSelect?: () => void;
}

export function OptionPlaceCard({ placeId, onSelect }: OptionPlaceCardProps) {
  const { data: place, isLoading } = usePlace(placeId);

  if (isLoading) return <Loader />;
  if (!place) return null;

  return (
    <PlaceCard place={place}>
      {onSelect && (
        <Button size="small" onClick={onSelect}>
          Select This
        </Button>
      )}
    </PlaceCard>
  );
}
