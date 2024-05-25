import {
  Card,
  Image,
  View,
  Heading,
  Badge,
  Text,
  Button,
  useTheme,
} from "@aws-amplify/ui-react";
import {
  ChoiceEntity,
  Place,
  RotationEntity,
  createOrUpdateChoice,
  createRotation,
  deleteRotation,
  selectChoice,
  updateChoice,
} from "../../entities";
import config from "../../../amplify_outputs.json";
import { useEffect, useState } from "react";

export const PlaceCard = (props: {
  place: Place;
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
}) => {
  const { tokens } = useTheme();
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const setup = async () => {
      if (!props.place.photos) {
        setUrl("https://placehold.co/600x400/EEE/31343C");
        return;
      }
      const getPlaceImageUrl = `${config.custom.getPlaceImageFunction}?placeName=${props.place.name}&photoId=${props.place.photos[0].name}&widthPx=${400}&heightPx=${400}`;
      const response = await fetch(getPlaceImageUrl);
      const json = await response.json();
      setUrl(json.photoUri);
    };
    setup();
  }, []);

  const handleAddToRotation = async (googlePlaceId: string) => {
    await createRotation(googlePlaceId);
  };

  const handleRemoveFromRotation = async (rotation: RotationEntity) => {
    await deleteRotation(rotation);
  };

  const handleAddToOptions = async (googlePlaceId: string) => {
    await createOrUpdateChoice(googlePlaceId);
  };

  const handleSelectOption = async (googlePlaceId: string) => {
    await selectChoice(currentChoice!, googlePlaceId);
  };

  const currentChoice = props.choices.find((c) => c.selectedPlaceId === "NONE");
  const rotationIds = props.rotation.map((r) => r.googlePlaceId);
  const rotation = props.rotation.find((r) => r.googlePlaceId);
  const isInRotation = rotationIds.includes(props.place.id);
  const handleRemoveOption = async (googlePlaceId: string) => {
    await updateChoice({
      ...currentChoice,
      id: currentChoice!.id!,
      optionPlaceIds: currentChoice!.optionPlaceIds.filter(
        (id) => id !== googlePlaceId,
      ),
    });
  };
  return (
    <Card textAlign={"center"} key={props.place.id} borderRadius="medium" variation="outlined">
      <View padding="xs">
        <Card fontSize={"medium"}>
          <Badge>{props.place.priceLevel}</Badge>
          <Badge variation="info">
            {props.place.currentOpeningHours?.openNow ? "Open" : "Closed"}
          </Badge>
          <Badge variation="success">
            {props.place.dineIn ? "Dine In" : "No Dine In"}
          </Badge>
          <Badge variation="warning">
            {props.place.takeout ? "Takeout" : "No Takeout"}
          </Badge>
          <Badge variation="error">
            {props.place.delivery ? "Delivery" : "No Delivery"}
          </Badge>
          <Heading margin={tokens.space.small}>
            {props.place.displayName.text}
          </Heading>
        </Card>
        <Image width={200} src={url} alt={props.place.displayName.text} />
        <Text>{props.place.shortFormattedAddress}</Text>
        <Text margin={tokens.space.small} fontSize={"small"}>
          {props.place.generativeSummary?.overview?.text ||
            props.place.editorialSummary?.text ||
            props.place.websiteUri}
        </Text>
        {isInRotation ? (
          <Button
            marginTop={tokens.space.xxxs}
            isFullWidth
            onClick={() => handleRemoveFromRotation(rotation!)}
            variation="destructive"
            marginRight={tokens.space.small}
          >
            Remove from Rotation
          </Button>
        ) : (
          <Button
            marginTop={tokens.space.xxxs}
            isFullWidth
            onClick={() => handleAddToRotation(props.place.id)}
            marginRight={tokens.space.small}
          >
            Add to Rotation
          </Button>
        )}
        {currentChoice?.optionPlaceIds?.includes(props.place.id) ? (
          <>
            {" "}
            <Button
              marginTop={tokens.space.xxxs}
              isFullWidth
              onClick={() => handleSelectOption(props.place.id)}
              variation="primary"
            >
              Select Option
            </Button>
            <Button
              marginTop={tokens.space.xxxs}
              isFullWidth
              onClick={() => handleRemoveOption(props.place.id)}
              variation="warning"
            >
              Remove Option
            </Button>
          </>
        ) : (
          <Button
            marginTop={tokens.space.xxxs}
            isFullWidth
            onClick={() => handleAddToOptions(props.place.id)}
            variation="primary"
          >
            Add as an Option
          </Button>
        )}
      </View>
    </Card>
  );
};
