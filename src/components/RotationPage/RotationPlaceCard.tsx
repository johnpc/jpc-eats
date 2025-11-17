import { Loader } from "@aws-amplify/ui-react";
import { usePlace } from "../../hooks/usePlace";
import { PlaceCard } from "../common/PlaceCard";
import { RotationEntity } from "../../lib/types";

interface RotationPlaceCardProps {
  rotationItem: RotationEntity;
}

export function RotationPlaceCard({ rotationItem }: RotationPlaceCardProps) {
  const { data: place, isLoading } = usePlace(rotationItem.googlePlaceId);

  if (isLoading) return <Loader />;
  if (!place) return null;

  return <PlaceCard place={place} />;
}
