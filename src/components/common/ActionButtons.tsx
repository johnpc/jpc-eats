import { Button, Flex, useTheme } from "@aws-amplify/ui-react";
import UpdateIcon from "@mui/icons-material/Update";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface ActionButtonsProps {
  isInRotation: boolean;
  isNominated: boolean;
  onAddToRotation: () => void;
  onRemoveFromRotation: () => void;
  onNominate: () => void;
  onRemoveNomination: () => void;
  onSelectNomination: () => void;
  disabled?: boolean;
}

export function ActionButtons({
  isInRotation,
  isNominated,
  onAddToRotation,
  onRemoveFromRotation,
  onNominate,
  onRemoveNomination,
  onSelectNomination,
  disabled = false,
}: ActionButtonsProps) {
  const { tokens } = useTheme();

  return (
    <Flex gap={tokens.space.small} justifyContent="flex-end">
      {isInRotation ? (
        <Button
          size="small"
          disabled={disabled}
          onClick={onRemoveFromRotation}
          variation="destructive"
        >
          <UpdateDisabledIcon />
        </Button>
      ) : (
        <Button
          size="small"
          disabled={disabled}
          onClick={onAddToRotation}
        >
          <UpdateIcon />
        </Button>
      )}

      {isNominated ? (
        <>
          <Button
            size="small"
            disabled={disabled}
            onClick={onSelectNomination}
            variation="primary"
          >
            <CheckCircleOutlineIcon />
          </Button>
          <Button
            size="small"
            disabled={disabled}
            onClick={onRemoveNomination}
            variation="warning"
          >
            <RemoveCircleOutlineIcon />
          </Button>
        </>
      ) : (
        <Button
          size="small"
          disabled={disabled}
          onClick={onNominate}
          variation="primary"
        >
          <AddCircleOutlineIcon />
        </Button>
      )}
    </Flex>
  );
}
