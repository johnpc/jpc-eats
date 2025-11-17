import { Loader } from "@aws-amplify/ui-react";
import { usePlace } from "../../hooks/usePlace";
import { PlaceCard } from "../common/PlaceCard";

interface OptionPlaceCardProps {
  placeId: string;
}

export function OptionPlaceCard({ placeId }: OptionPlaceCardProps) {
  const { data: place, isLoading } = usePlace(placeId);

  if (isLoading) return <Loader />;
  if (!place) return null;

  return <PlaceCard place={place} />;
}
