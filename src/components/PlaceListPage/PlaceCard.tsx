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

  const handleAddToOptions = async (googlePlaceId: string) => {
    await createOrUpdateChoice(googlePlaceId);
  };

  const currentChoice = props.choices.find((c) => c.selectedPlaceId === "NONE");
  const rotationIds = props.rotation.map((r) => r.googlePlaceId);
  const isInRotation = rotationIds.includes(props.place.id);

  return (
    <Card key={props.place.id} borderRadius="medium" variation="outlined">
      <View padding="xs">
        <Card fontSize={"medium"}>
          <Badge>{props.place.priceLevel}</Badge>
          <Badge variation="info">
            {props.place.currentOpeningHours.openNow ? "Open" : "Closed"}
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
        <Image src={url} alt={props.place.displayName.text} />
        <Text padding="medium">{props.place.shortFormattedAddress}</Text>
        <Text margin={tokens.space.small} fontSize={"small"}>
          {props.place.generativeSummary?.overview?.text ||
            props.place.editorialSummary?.text ||
            props.place.websiteUri}
        </Text>
        {isInRotation ? null : (
          <Button
            onClick={() => handleAddToRotation(props.place.id)}
            marginRight={tokens.space.small}
          >
            Add to Rotation
          </Button>
        )}
        {currentChoice?.optionPlaceIds?.includes(props.place.id) ? null : (
          <Button
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
