import {
  Card,
  Image,
  View,
  Heading,
  Text,
  Button,
  useTheme,
  Pagination,
  Link,
} from "@aws-amplify/ui-react";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
  createOrUpdateChoice,
  createRotation,
  deleteRotation,
  listChoice,
  selectChoice,
  updateChoice,
} from "../../entities";
import { useEffect, useState } from "react";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import UpdateIcon from "@mui/icons-material/Update";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
const client = generateClient<Schema>();

export const PlaceCard = (props: {
  place: Place;
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
  requireAuth?: () => boolean;
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

      const urlPromises = (props.place.photos ?? []).map(
        async (photoId: { name: string }) => {
          console.log({ photoId });
          const response = await client.queries.getGooglePlaceImage({
            photoId: photoId.name,
            heightPx: 400,
            widthPx: 400,
          });
          return response.data!.photoUri;
        },
      );
      const urls = await Promise.all(urlPromises);
      setPhotoUrls(urls);
    };
    setup();
  }, []);

  const handleAddToRotation = async (googlePlaceId: string) => {
    if (props.requireAuth && !props.requireAuth()) {
      return;
    }
    
    try {
      setIsDisabled(true);
      console.log("Adding to rotation:", googlePlaceId);
      const result = await createRotation(googlePlaceId);
      console.log("Added to rotation successfully:", result);
      // Force a small delay to ensure the subscription has time to process
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error adding to rotation:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleRemoveFromRotation = async (rotation: RotationEntity) => {
    if (props.requireAuth && !props.requireAuth()) {
      return;
    }
    
    try {
      setIsDisabled(true);
      console.log("Removing from rotation:", rotation);
      const result = await deleteRotation(rotation);
      console.log("Removed from rotation successfully:", result);
      // Force a small delay to ensure the subscription has time to process
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error removing from rotation:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleAddToOptions = async (googlePlaceId: string) => {
    if (props.requireAuth && !props.requireAuth()) {
      return;
    }
    
    try {
      setIsDisabled(true);
      console.log("Adding to options:", googlePlaceId);
      const result = await createOrUpdateChoice(googlePlaceId);
      console.log("Added to options successfully:", result);

      // Force a direct refresh of the current choices
      try {
        const freshChoices: ChoiceEntity[] = await listChoice();
        console.log("Fresh choices after adding option:", freshChoices);

        // Find the current choice with NONE as selectedPlaceId
        const currentChoice = freshChoices.find(
          (c) => c.selectedPlaceId === "NONE",
        );
        console.log("Current choice after refresh:", currentChoice);

        if (currentChoice) {
          // Verify the place ID was actually added
          if (currentChoice.optionPlaceIds.includes(googlePlaceId)) {
            console.log("Verified place was added to options:", googlePlaceId);
          } else {
            console.warn(
              "Place was not found in options after adding:",
              googlePlaceId,
            );
            // Try to add it again with a direct update
            if (currentChoice.id) {
              console.log("Attempting direct update to add place to options");
              await updateChoice({
                ...currentChoice,
                optionPlaceIds: [
                  googlePlaceId,
                  ...currentChoice.optionPlaceIds,
                ],
              });
            }
          }
        }
      } catch (refreshError) {
        console.error("Error refreshing choices after add:", refreshError);
      }

      // Force a small delay to ensure the subscription has time to process
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error adding to options:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleSelectOption = async (googlePlaceId: string) => {
    if (props.requireAuth && !props.requireAuth()) {
      return;
    }
    
    try {
      setIsDisabled(true);
      console.log("Selecting option:", googlePlaceId);
      const result = await selectChoice(currentChoice!, googlePlaceId);
      console.log("Selected option successfully:", result);
      // Force a small delay to ensure the subscription has time to process
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error selecting option:", error);
    } finally {
      setIsDisabled(false);
    }
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
  const rotation = props.rotation.find(
    (r) => r.googlePlaceId === props.place.id,
  );
  const isInRotation = rotationIds.includes(props.place.id);
  const handleRemoveOption = async (googlePlaceId: string) => {
    if (props.requireAuth && !props.requireAuth()) {
      return;
    }
    
    try {
      setIsDisabled(true);
      console.log("Removing option:", googlePlaceId);
      if (!currentChoice) {
        console.error("No current choice found");
        return;
      }

      const result = await updateChoice({
        ...currentChoice,
        id: currentChoice.id!,
        optionPlaceIds: currentChoice.optionPlaceIds.filter(
          (id) => id !== googlePlaceId,
        ),
        createdAt: currentChoice.createdAt,
        updatedAt: currentChoice.updatedAt,
      });

      console.log("Removed option successfully:", result);
      // Force a small delay to ensure the subscription has time to process
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error removing option:", error);
    } finally {
      setIsDisabled(false);
    }
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
            <Link href={props.place.websiteUri}>
              {props.place.displayName.text}
            </Link>
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
            <Link href={props.place.websiteUri}>
              {props.place.displayName.text}
            </Link>
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
        {(photoUrls ?? []).length <= 1 ? null : (
          <Pagination
            currentPage={selectedUrlIndex}
            totalPages={(photoUrls ?? []).length}
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
