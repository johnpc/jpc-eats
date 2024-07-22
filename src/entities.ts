import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Subscription } from "rxjs";
import config from "../amplify_outputs.json";
import { Schema } from "../amplify/data/resource";
Amplify.configure(config);
const client = generateClient<Schema>({
  authMode: "userPool",
});

export type PlaceV1 = {
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours: {
    open_now: boolean;
  };
  photos: {
    height: number;
    width: number;
    photo_reference: string;
  }[];
  place_id: string;
  price_level: number;
  rating: number;
  reference: string;
  types: string[];
  vicinity: string;
};

export type RotationEntity = {
  id: string;
  googlePlaceId: string;
};

export type ChoiceEntity = {
  id: string;
  optionPlaceIds: (string | null)[];
  selectedPlaceId?: string | null;
  updatedAt: string;
  createdAt: string;
};

export type Place = {
  id: string; // identifier
  images: string[]; // base64 images
  name: string; // identifier
  displayName: {
    languageCode: string; // "en"
    text: string; // "Zingerman's Delicatessen"
  };
  types: string[]; // tags such as 'restaurant', 'coffee_shop', 'sandwich_shop'
  nationalPhoneNumber: string; // such as "(734) 663-3354"
  formattedAddress: string; // such as "422 Detroit St, Ann Arbor, MI 48104, USA"
  shortFormattedAddress: string; // such as "422 Detroit St, Ann Arbor"
  websiteUri: string; // such as "http://www.zingermansdeli.com/"
  priceLevel: string; // such as "PRICE_LEVEL_MODERATE"
  primaryType: string; // such as "restaurant"
  primaryTypeDisplayName: {
    languageCode: string; // "en"
    text: string; // "Restaurant"
  };
  iconBackgroundColor: string; // "#FF9E67"
  iconMaskBaseUri: string; // "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet"
  editorialSummary: {
    languageCode: string; // "en"
    text: string; // "Locals line up for generous deli sandwiches at this funky, longtime market with specialty groceries."
  };
  generativeSummary: {
    description: {
      languageCode: string; // ""en-US""
      text: string; // "Long-running deli and market supplying sandwiches and baked goods in Kerrytown. The extensive menu features giant portions of reubens, corned beef, and pastrami, as well as salads, latkes, and desserts. The market area sells cheese, meat, and fine olive oils, in addition to bread and coffee. There's a cozy, historic atmosphere, and customers say it's good for kids. Some reviews mention the cool experience and helpful, attentive staff. Customers typically spend $20–30."
    };
    overview: {
      languageCode: string; // ""en-US""
      text: string; // "Established deli with a large selection of sandwiches, cheeses and meats, plus wine and desserts."
    };
  };
  // Retrieved from https://places.googleapis.com/v1/places/ChIJ2fzCmcW7j4AR2JzfXBBoh6E/photos/AUacShh3_Dd8yvV2JZMtNjjbbSbFhSv-0VmUN-uasQ2Oj00XB63irPTks0-A_1rMNfdTunoOVZfVOExRRBNrupUf8TY4Kw5iQNQgf2rwcaM8hXNQg7KDyvMR5B-HzoCE1mwy2ba9yxvmtiJrdV-xBgO8c5iJL65BCd0slyI1/media?maxHeightPx=400&maxWidthPx=400&key=<API_KEY>
  photos: {
    name: string;
    heightPx: number;
    widthPx: number;
  }[];
  takeout: boolean;
  dineIn: boolean;
  delivery: boolean;
  servesCocktails: boolean;
  allowsDogs: boolean;
  goodForWatchingSports: boolean;
  goodForGroups: boolean;
  outdoorSeating: boolean;
  regularOpeningHours: {
    openNow: boolean;
    weekdayDescriptions: string[];
    periods: {
      open: {
        day: number;
        hour: number;
        minute: number;
      };
      close: {
        day: number;
        hour: number;
        minute: number;
      };
    }[];
  };
  currentOpeningHours: {
    openNow: boolean;
    weekdayDescriptions: string[];
    periods: {
      open: {
        day: number;
        hour: number;
        minute: number;
      };
      close: {
        day: number;
        hour: number;
        minute: number;
      };
    }[];
  };
};

export const listRotation = async (): Promise<RotationEntity[]> => {
  const rotation = await client.models.Rotation.list();
  return rotation.data;
};

export const listChoice = async (): Promise<ChoiceEntity[]> => {
  const choice = await client.models.Choice.list();
  return choice.data;
};

export const createRotation = async (
  googlePlaceId: string,
): Promise<RotationEntity> => {
  const rotation = await client.models.Rotation.create({
    googlePlaceId,
  });

  return rotation.data!;
};

export const deleteRotation = async (
  rotation: RotationEntity,
): Promise<RotationEntity> => {
  await client.models.Rotation.delete({
    id: rotation.id,
  });

  return rotation;
};

export const updateChoice = async (
  choice: ChoiceEntity,
): Promise<ChoiceEntity> => {
  const updatedChoice = await client.models.Choice.update({
    id: choice.id,
    optionPlaceIds: choice.optionPlaceIds,
  });
  return updatedChoice.data!;
};

export const createOrUpdateChoice = async (
  googlePlaceId: string,
): Promise<ChoiceEntity> => {
  const incompleteChoices =
    await client.models.Choice.listChoiceBySelectedPlaceId({
      selectedPlaceId: "NONE",
    });
  console.log({ incompleteChoices });
  const incompleteChoice = incompleteChoices.data.find((i) => i);
  if (incompleteChoice) {
    const updatedChoice = await client.models.Choice.update({
      id: incompleteChoice.id,
      selectedPlaceId: "NONE",
      optionPlaceIds: [googlePlaceId, ...incompleteChoice.optionPlaceIds],
    });
    return updatedChoice.data!;
  }

  const createdChoice = await client.models.Choice.create({
    selectedPlaceId: "NONE",
    optionPlaceIds: [googlePlaceId],
  });

  return createdChoice.data!;
};

export const selectChoice = async (
  choice: ChoiceEntity,
  selectionPlaceId: string,
): Promise<ChoiceEntity> => {
  const updatedChoice = await client.models.Choice.update({
    id: choice.id,
    selectedPlaceId: selectionPlaceId,
  });
  return updatedChoice.data!;
};

export const createRotationListener = (
  fn: (rotationItem: RotationEntity) => void,
) => {
  const listener = client.models.Rotation.onCreate().subscribe({
    next: async (rotation: Schema["Rotation"]["type"]) => {
      fn(rotation);
    },
    error: (error: Error) => {
      console.error("Subscription error", error);
    },
  });
  return listener;
};

export const createChoiceListener = (
  fn: (choiceItem: ChoiceEntity) => void,
) => {
  const listener = client.models.Choice.onCreate().subscribe({
    next: async (choice: Schema["Choice"]["type"]) => {
      fn(choice);
    },
    error: (error: Error) => {
      console.error("Subscription error", error);
    },
  });
  return listener;
};

export const deleteRotationListener = (
  fn: (rotationItem: RotationEntity) => void,
) => {
  const listener = client.models.Rotation.onDelete().subscribe({
    next: async (rotation: Schema["Rotation"]["type"]) => {
      fn(rotation);
    },
    error: (error: Error) => {
      console.error("Subscription error", error);
    },
  });
  return listener;
};

export const updateChoiceListener = (
  fn: (choiceItem: ChoiceEntity) => void,
) => {
  const listener = client.models.Choice.onUpdate().subscribe({
    next: async (choice: Schema["Choice"]["type"]) => {
      fn(choice);
    },
    error: (error: Error) => {
      console.error("Subscription error", error);
    },
  });
  return listener;
};

export const unsubscribeListener = (subscription: Subscription) => {
  return subscription.unsubscribe();
};
