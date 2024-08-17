import {
  Card,
  Image,
  View,
  Heading,
  Text,
  Button,
  useTheme,
  Pagination,
} from "@aws-amplify/ui-react";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
  createOrUpdateChoice,
  createRotation,
  deleteRotation,
  selectChoice,
  updateChoice,
} from "../../entities";
import config from "../../../amplify_outputs.json";
import { useEffect, useState } from "react";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import UpdateIcon from "@mui/icons-material/Update";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const PlaceCard = (props: {
  place: Place;
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const { tokens } = useTheme();
  const [selectedUrlIndex, setSelectedUrlIndex] = useState<number>(1);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    "https://placehold.co/600x400/EEE/31343C",
  ]);
  useEffect(() => {
    const setup = async () => {
      if (!props.place.photos || props.preferences.compactMode) {
        return;
      }
      // const photoName = props.place.photos[0].name
      // const getPlaceImageUrl = `${config.custom.getPlaceImageFunction}?placeName=${props.place.name}&photoId=${photoName}&widthPx=${400}&heightPx=${400}`;
      // const response = await fetch(getPlaceImageUrl);
      // const json = await response.json();
      // setPhotoUrls([json.photoUri]);

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
  }, []);

  const handleAddToRotation = async (googlePlaceId: string) => {
    setIsDisabled(true);
    await createRotation(googlePlaceId);
    setIsDisabled(false);
  };

  const handleRemoveFromRotation = async (rotation: RotationEntity) => {
    setIsDisabled(true);
    await deleteRotation(rotation);
    setIsDisabled(false);
  };

  const handleAddToOptions = async (googlePlaceId: string) => {
    setIsDisabled(true);
    await createOrUpdateChoice(googlePlaceId);
    setIsDisabled(false);
  };

  const handleSelectOption = async (googlePlaceId: string) => {
    setIsDisabled(true);
    await selectChoice(currentChoice!, googlePlaceId);
    setIsDisabled(false);
  };

  const handleNextPage = () => {
    console.log("handleNextPage");
    setSelectedUrlIndex(selectedUrlIndex + 1);
  };

  const handlePreviousPage = () => {
    console.log("handlePreviousPage");
    setSelectedUrlIndex(selectedUrlIndex - 1);
  };

  const handleOnChange = (newPageIndex?: number, prevPageIndex?: number) => {
    console.log(
      `handleOnChange \n - newPageIndex: ${newPageIndex} \n - prevPageIndex: ${prevPageIndex}`,
    );
    setSelectedUrlIndex(newPageIndex ?? 1);
  };

  const currentChoice = props.choices.find((c) => c.selectedPlaceId === "NONE");
  const rotationIds = props.rotation.map((r) => r.googlePlaceId);
  const rotation = props.rotation.find((r) => r.googlePlaceId === props.place.id);
  const isInRotation = rotationIds.includes(props.place.id);
  const handleRemoveOption = async (googlePlaceId: string) => {
    await updateChoice({
      ...currentChoice,
      id: currentChoice!.id!,
      optionPlaceIds: currentChoice!.optionPlaceIds.filter(
        (id) => id !== googlePlaceId,
      ),
      createdAt: currentChoice!.createdAt,
      updatedAt: currentChoice!.updatedAt,
    });
  };

  if (props.preferences.compactMode) {
    return (
      <Card key={props.place.id} borderRadius="medium" variation="elevated">
        <View width={"40%"} display={"inline-block"}>
          <Heading
            display={"inline-block"}
            textAlign={"left"}
            margin={tokens.space.small}
          >
            {props.place.displayName.text}
          </Heading>
        </View>
        <View textAlign={"right"} width={"60%"} display={"inline-block"}>
          {isInRotation ? (
            <Button
              display={"inline-block"}
              size="small"
              disabled={isDisabled}
              onClick={() => handleRemoveFromRotation(rotation!)}
              variation="destructive"
              marginRight={tokens.space.small}
            >
              <UpdateDisabledIcon />
            </Button>
          ) : (
            <Button
              display={"inline-block"}
              size="small"
              disabled={isDisabled}
              onClick={() => handleAddToRotation(props.place.id)}
              marginRight={tokens.space.small}
            >
              <UpdateIcon />
            </Button>
          )}
          {currentChoice?.optionPlaceIds?.includes(props.place.id) ? (
            <>
              <Button
                display={"inline-block"}
                marginRight={tokens.space.small}
                onClick={() => handleSelectOption(props.place.id)}
                size="small"
                disabled={isDisabled}
                variation="primary"
              >
                <CheckCircleOutlineIcon />
              </Button>
              <Button
                display={"inline-block"}
                size="small"
                disabled={isDisabled}
                onClick={() => handleRemoveOption(props.place.id)}
                variation="warning"
              >
                <RemoveCircleOutlineIcon />
              </Button>
            </>
          ) : (
            <Button
              display={"inline-block"}
              size="small"
              disabled={isDisabled}
              onClick={() => handleAddToOptions(props.place.id)}
              variation="primary"
            >
              <AddCircleOutlineIcon />
            </Button>
          )}
        </View>
      </Card>
    );
  }

  return (
    <Card
      textAlign={"center"}
      key={props.place.id}
      borderRadius="medium"
      variation="outlined"
    >
      <View>
        <View padding="xs" width={"50%"} display={"inline-block"}>
          {/* <Badge>{props.place.priceLevel}</Badge>
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
          </Badge> */}
          <Heading margin={tokens.space.small}>
            {props.place.displayName.text}
          </Heading>
          {/* <Text>{props.place.shortFormattedAddress}</Text> */}
          <Text margin={tokens.space.small} fontSize={"small"}>
            {props.place.generativeSummary?.overview?.text ||
              props.place.editorialSummary?.text ||
              props.place.websiteUri}
          </Text>
        </View>
        {photoUrls[selectedUrlIndex - 1] ===
        "https://placehold.co/600x400/EEE/31343C" ? null : (
          <View width={"50%"} display={"inline-block"}>
            <Image
              width={250}
              src={photoUrls[selectedUrlIndex - 1]}
              alt={props.place.displayName.text}
            />
          </View>
        )}
        {photoUrls.length <= 1 ? null : (
          <Pagination
            currentPage={selectedUrlIndex}
            totalPages={photoUrls.length}
            siblingCount={1}
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
            onChange={handleOnChange}
          />
        )}
        {isInRotation ? (
          <Button
            onClick={() => handleRemoveFromRotation(rotation!)}
            variation="destructive"
            marginRight={tokens.space.small}
            disabled={isDisabled}
          >
            Remove from Rotation
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToRotation(props.place.id)}
            marginRight={tokens.space.small}
            disabled={isDisabled}
          >
            Add to Rotation
          </Button>
        )}
        {currentChoice?.optionPlaceIds?.includes(props.place.id) ? (
          <>
            {" "}
            <Button
              onClick={() => handleSelectOption(props.place.id)}
              variation="primary"
              disabled={isDisabled}
            >
              Select Option
            </Button>
            <Button
              onClick={() => handleRemoveOption(props.place.id)}
              variation="warning"
              disabled={isDisabled}
            >
              Remove Option
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleAddToOptions(props.place.id)}
            variation="primary"
            disabled={isDisabled}
          >
            Add as an Option
          </Button>
        )}
      </View>
    </Card>
  );
};
