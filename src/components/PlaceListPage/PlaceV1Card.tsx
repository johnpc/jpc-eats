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
  PlaceV1,
  RotationEntity,
  createOrUpdateChoice,
  createRotation,
  selectChoice,
} from "../../entities";
import config from "../../../amplify_outputs.json";
import { useEffect, useState } from "react";

export const PlaceV1Card = (props: {
  place: PlaceV1;
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
}) => {
  const { tokens } = useTheme();
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const setup = async () => {
      const getPlaceImageUrl = `${config.custom.getPlaceImageV1Function}?placeName=${props.place.name}&photoId=${props.place.photos[0].photo_reference}&widthPx=${400}&heightPx=${400}`;
      const response = await fetch(getPlaceImageUrl);
      const json = await response.json();
      setUrl(json.imageUrl);
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
  const isInRotation = rotationIds.includes(props.place.place_id);
  const handleSelectOption = async (googlePlaceId: string) => {
    await selectChoice(currentChoice!, googlePlaceId);
  };
  return (
    <Card key={props.place.place_id} borderRadius="medium" variation="outlined">
      <View padding="xs">
        <Card fontSize={"medium"}>
          <Badge>{props.place.price_level}</Badge>
          <Badge variation="info">
            {props.place.opening_hours?.open_now ? "Open" : "Closed"}
          </Badge>
          <Heading margin={tokens.space.small}>{props.place.name}</Heading>
        </Card>
        <Image src={url} alt={props.place.name} />
        <Text padding="medium">{props.place.vicinity}</Text>
        {isInRotation ? null : (
          <Button
            onClick={() => handleAddToRotation(props.place.place_id)}
            marginRight={tokens.space.small}
          >
            Add to Rotation
          </Button>
        )}
        {currentChoice?.optionPlaceIds?.includes(props.place.place_id) ? (
          <>
            <Button
              onClick={() => handleSelectOption(props.place.place_id)}
              variation="primary"
            >
              Select Option
            </Button>
            <Button
              onClick={() => handleSelectOption(props.place.place_id)}
              variation="warning"
            >
              Remove From Options Option
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleAddToOptions(props.place.place_id)}
            variation="primary"
          >
            Add as an Option
          </Button>
        )}
      </View>
    </Card>
  );
};
