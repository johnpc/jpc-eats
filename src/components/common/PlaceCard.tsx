import { Card, Heading, Text, Flex, Link, useTheme } from "@aws-amplify/ui-react";
import { useRotation, useAddToRotation, useRemoveFromRotation } from "../../hooks/useRotation";
import { useChoices, useCreateChoice, useUpdateChoice } from "../../hooks/useChoices";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { ActionButtons } from "./ActionButtons";
import { AuthModal } from "../AuthModal";
import { ReactNode } from "react";

interface PlaceCardProps {
  place: {
    id: string;
    name?: string | null;
    displayName?: { text?: string | null } | null;
    websiteUri?: string | null;
    shortFormattedAddress?: string | null;
    primaryTypeDisplayName?: { text?: string | null } | null;
  };
  children?: ReactNode;
}

export function PlaceCard({ place, children }: PlaceCardProps) {
  const { tokens } = useTheme();
  const name = place.displayName?.text || place.name;

  const { data: rotation = [] } = useRotation();
  const { data: choices = [] } = useChoices();
  const addToRotation = useAddToRotation();
  const removeFromRotation = useRemoveFromRotation();
  const createChoice = useCreateChoice();
  const updateChoice = useUpdateChoice();
  const { requireAuth, showAuthModal, closeAuthModal } = useRequireAuth();

  const currentChoice = choices.find((c) => !c.selectedPlaceId || c.selectedPlaceId === "NONE");
  const rotationItem = rotation.find((r) => r.googlePlaceId === place.id);
  const isInRotation = !!rotationItem;
  const isNominated = currentChoice?.optionPlaceIds?.includes(place.id) || false;

  const handleAddToRotation = () => {
    requireAuth(() => addToRotation.mutate(place.id));
  };

  const handleRemoveFromRotation = () => {
    requireAuth(() => rotationItem && removeFromRotation.mutate(rotationItem.id));
  };

  const handleNominate = () => {
    requireAuth(() => {
      if (currentChoice) {
        const newOptions = [...currentChoice.optionPlaceIds.filter((id): id is string => !!id), place.id];
        updateChoice.mutate({ id: currentChoice.id, optionPlaceIds: newOptions });
      } else {
        createChoice.mutate([place.id]);
      }
    });
  };

  const handleRemoveNomination = () => {
    requireAuth(() => {
      if (currentChoice) {
        const newOptions = currentChoice.optionPlaceIds.filter((id) => id !== place.id);
        updateChoice.mutate({ id: currentChoice.id, optionPlaceIds: newOptions });
      }
    });
  };

  const handleSelectNomination = () => {
    requireAuth(() => {
      if (currentChoice) {
        updateChoice.mutate({ id: currentChoice.id, selectedPlaceId: place.id });
      }
    });
  };

  const isDisabled = addToRotation.isPending || removeFromRotation.isPending || 
                      createChoice.isPending || updateChoice.isPending;

  return (
    <>
      <Card variation="elevated">
        <Flex direction="column" gap={tokens.space.xs}>
          {place.websiteUri ? (
            <Link href={place.websiteUri} isExternal>
              <Heading level={5}>{name}</Heading>
            </Link>
          ) : (
            <Heading level={5}>{name}</Heading>
          )}
          {place.shortFormattedAddress && (
            <Text fontSize="small" color={tokens.colors.font.secondary}>
              {place.shortFormattedAddress}
            </Text>
          )}
          {place.primaryTypeDisplayName?.text && (
            <Text fontSize="small">{place.primaryTypeDisplayName.text}</Text>
          )}
          {children || (
            <ActionButtons
              isInRotation={isInRotation}
              isNominated={isNominated}
              onAddToRotation={handleAddToRotation}
              onRemoveFromRotation={handleRemoveFromRotation}
              onNominate={handleNominate}
              onRemoveNomination={handleRemoveNomination}
              onSelectNomination={handleSelectNomination}
              disabled={isDisabled}
            />
          )}
        </Flex>
      </Card>
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
