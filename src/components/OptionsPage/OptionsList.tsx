import { Collection, useTheme } from "@aws-amplify/ui-react";
import { OptionPlaceCard } from "./OptionPlaceCard";

interface OptionsListProps {
  placeIds: string[];
  choiceId?: string;
  onSelect?: (placeId: string) => void;
}

export function OptionsList({ placeIds, choiceId, onSelect }: OptionsListProps) {
  const { tokens } = useTheme();

  return (
    <Collection
      items={placeIds}
      type="list"
      direction="column"
      gap="medium"
      marginBottom={tokens.space.medium}
    >
      {(placeId) => (
        <OptionPlaceCard
          key={placeId}
          placeId={placeId}
          onSelect={choiceId && onSelect ? () => onSelect(placeId) : undefined}
        />
      )}
    </Collection>
  );
}
