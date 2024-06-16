import {
  Card,
  Image,
  View,
  Heading,
  Badge,
  Text,
  Button,
  useTheme,
  Pagination,
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
  const [selectedUrlIndex, setSelectedUrlIndex] = useState<number>(1);
  const [photoUrls, setPhotoUrls] = useState<string[]>(["https://placehold.co/600x400/EEE/31343C"]);
  useEffect(() => {
    const setup = async () => {
      if (!props.place.photos) {
        return;
      }
      const urlPromises = (props.place.photos ?? []).map(async (photoId) => {
        const getPlaceImageUrl = `${config.custom.getPlaceImageFunction}?placeName=${props.place.name}&photoId=${photoId.name}&widthPx=${400}&heightPx=${400}`;
        const response = await fetch(getPlaceImageUrl);
        const json = await response.json();
        return json.photoUri;
      });
      const urls = await Promise.all(urlPromises);
      setPhotoUrls(urls);
    };
    setup();
  }, [props.place.name, props.place.photos]);

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

  const handleNextPage = () => {
    console.log('handleNextPage');
    setSelectedUrlIndex(selectedUrlIndex + 1);
  };

  const handlePreviousPage = () => {
    console.log('handlePreviousPage');
    setSelectedUrlIndex(selectedUrlIndex - 1);
  };

  const handleOnChange = (newPageIndex?: number, prevPageIndex?: number) => {
    console.log(
      `handleOnChange \n - newPageIndex: ${newPageIndex} \n - prevPageIndex: ${prevPageIndex}`
    );
    setSelectedUrlIndex(newPageIndex ?? 1);
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
    <Card
      textAlign={"center"}
      key={props.place.id}
      borderRadius="medium"
      variation="outlined"
    >
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
        <Image width={200} src={photoUrls[selectedUrlIndex - 1]} alt={props.place.displayName.text} />
        <Pagination
          currentPage={selectedUrlIndex}
          totalPages={photoUrls.length}
          siblingCount={1}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
          onChange={handleOnChange}
        />
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
