import { Collection, useTheme } from "@aws-amplify/ui-react";
import { RotationPlaceCard } from "./RotationPlaceCard";
import { RotationEntity } from "../../lib/types";

interface RotationListProps {
  rotation: RotationEntity[];
}

export function RotationList({ rotation }: RotationListProps) {
  const { tokens } = useTheme();

  return (
    <Collection
      items={rotation}
      type="list"
      direction="column"
      gap="medium"
      marginBottom={tokens.space.medium}
    >
      {(item) => <RotationPlaceCard key={item.id} rotationItem={item} />}
    </Collection>
  );
}
