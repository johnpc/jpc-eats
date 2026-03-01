import { Heading, Loader, Divider, Text, useTheme } from "@aws-amplify/ui-react";
import { useSharedChoices, useUpdateChoice } from "../../hooks/useChoices";
import { OptionsList } from "./OptionsList";
import { ChoiceEntity } from "../../lib/types";

export function SharedChoices() {
  const { tokens } = useTheme();
  const { data: sharedChoices = [], isLoading } = useSharedChoices();
  const updateChoice = useUpdateChoice();

  const handleSelect = (choice: ChoiceEntity, placeId: string) => {
    updateChoice.mutate({ id: choice.id, selectedPlaceId: placeId });
  };

  if (isLoading) return <Loader />;
  if (!sharedChoices.length) return null;

  return (
    <>
      <Divider marginTop={tokens.space.large} marginBottom={tokens.space.medium} />
      <Heading level={4} marginBottom={tokens.space.xs}>Shared With You</Heading>
      <Text fontSize="small" color={tokens.colors.font.secondary} marginBottom={tokens.space.small}>
        Someone added you as a favorite - pick one!
      </Text>
      {sharedChoices.map((choice) => (
        <OptionsList
          key={choice.id}
          placeIds={choice.optionPlaceIds.filter((id): id is string => !!id)}
          choiceId={choice.id}
          onSelect={(placeId) => handleSelect(choice, placeId)}
        />
      ))}
    </>
  );
}
