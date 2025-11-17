import { Collection, useTheme } from "@aws-amplify/ui-react";
import { OptionPlaceCard } from "./OptionPlaceCard";

interface OptionsListProps {
  placeIds: string[];
}

export function OptionsList({ placeIds }: OptionsListProps) {
  const { tokens } = useTheme();

  return (
    <Collection
      items={placeIds}
      type="list"
      direction="column"
      gap="medium"
      marginBottom={tokens.space.medium}
    >
      {(placeId) => <OptionPlaceCard key={placeId} placeId={placeId} />}
    </Collection>
  );
}
