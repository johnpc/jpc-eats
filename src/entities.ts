import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Subscription } from "rxjs";
import config from "../amplify_outputs.json";
import { Schema } from "../amplify/data/resource";
Amplify.configure(config);
const client = generateClient<Schema>({
  authMode: "userPool",
});

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

export type PreferencesEntity = {
  id?: string;
  compactMode?: boolean | null;
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
  try {
    console.log("Fetching all choices...");
    const response = await client.models.Choice.list();
    console.log("Choices fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching choices:", error);
    return [];
  }
};

export const getPreferences = async (): Promise<PreferencesEntity> => {
  const allPreferences = (await client.models.Preferences.list()).data ?? [];
  const preferences = allPreferences
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .find((g) => g);

  if (!preferences) {
    return {
      id: undefined,
      compactMode: false,
    };
  }
  return preferences;
};

export const updatePreferences = async (
  preferences: PreferencesEntity,
): Promise<PreferencesEntity> => {
  if (!preferences.id) {
    const preference = await client.models.Preferences.create({
      compactMode: preferences.compactMode ?? false,
    });
    return preference.data!;
  } else {
    const preference = await client.models.Preferences.update({
      id: preferences.id,
      compactMode: preferences.compactMode,
    });
    return preference.data!;
  }
};

// Add a refresh mechanism to force data refresh
let refreshCallbacks: (() => void)[] = [];

export const registerRefreshCallback = (callback: () => void) => {
  refreshCallbacks.push(callback);
  return () => {
    refreshCallbacks = refreshCallbacks.filter((cb) => cb !== callback);
  };
};

export const triggerRefresh = () => {
  refreshCallbacks.forEach((callback) => callback());
};

// Modify the existing functions to trigger refresh
export const createRotation = async (
  googlePlaceId: string,
): Promise<RotationEntity> => {
  try {
    // Check if the place already exists in rotation to prevent duplicates
    const existingRotation = await client.models.Rotation.list();
    const alreadyExists = existingRotation.data.some(
      (item) => item.googlePlaceId === googlePlaceId,
    );

    if (alreadyExists) {
      // Return the existing rotation item instead of creating a duplicate
      const existingItem = existingRotation.data.find(
        (item) => item.googlePlaceId === googlePlaceId,
      )!;
      console.log("Place already exists in rotation:", existingItem);
      return existingItem;
    }

    // Create new rotation item only if it doesn't already exist
    console.log("Creating new rotation item for:", googlePlaceId);
    const rotation = await client.models.Rotation.create({
      googlePlaceId,
    });

    console.log("Rotation created successfully:", rotation.data);

    // Trigger refresh to update UI
    setTimeout(() => triggerRefresh(), 500);

    return rotation.data!;
  } catch (error) {
    console.error("Error creating rotation:", error);
    throw error;
  }
};

export const deleteRotation = async (
  rotation: RotationEntity,
): Promise<RotationEntity> => {
  try {
    console.log("Deleting rotation item:", rotation);
    await client.models.Rotation.delete({
      id: rotation.id,
    });

    console.log("Rotation deleted successfully");

    // Trigger refresh to update UI
    setTimeout(() => triggerRefresh(), 500);

    return rotation;
  } catch (error) {
    console.error("Error deleting rotation:", error);
    throw error;
  }
};

export const updateChoice = async (
  choice: ChoiceEntity,
): Promise<ChoiceEntity> => {
  try {
    console.log("Updating choice:", choice);
    const updatedChoice = await client.models.Choice.update({
      id: choice.id,
      optionPlaceIds: choice.optionPlaceIds,
    });

    console.log("Choice updated successfully:", updatedChoice.data);

    // Trigger refresh to update UI
    setTimeout(() => triggerRefresh(), 500);

    return updatedChoice.data!;
  } catch (error) {
    console.error("Error updating choice:", error);
    throw error;
  }
};

export const createOrUpdateChoice = async (
  googlePlaceId: string,
): Promise<ChoiceEntity> => {
  try {
    console.log("Starting createOrUpdateChoice for place:", googlePlaceId);

    // First, get the latest choices to ensure we're working with current data
    const allChoices = await client.models.Choice.list();
    console.log("All current choices:", allChoices.data);

    const incompleteChoices = allChoices.data.filter(
      (c) => c.selectedPlaceId === "NONE",
    );
    console.log("Incomplete choices:", incompleteChoices);

    const incompleteChoice = incompleteChoices[0]; // Take the first incomplete choice if multiple exist

    if (incompleteChoice) {
      // Check if the place ID already exists in the options to prevent duplicates
      if (!incompleteChoice.optionPlaceIds.includes(googlePlaceId)) {
        console.log("Updating existing choice with new place:", googlePlaceId);

        // Create a new array with the new place ID at the beginning
        const updatedOptionPlaceIds = [
          googlePlaceId,
          ...incompleteChoice.optionPlaceIds,
        ];
        console.log("Updated option place IDs:", updatedOptionPlaceIds);

        const updatedChoice = await client.models.Choice.update({
          id: incompleteChoice.id,
          selectedPlaceId: "NONE",
          optionPlaceIds: updatedOptionPlaceIds,
        });

        console.log("Choice updated successfully:", updatedChoice.data);

        // Verify the update worked
        const verifyChoice = await client.models.Choice.get({
          id: incompleteChoice.id,
        });
        console.log("Verified updated choice:", verifyChoice.data);

        // Trigger refresh to update UI
        setTimeout(() => triggerRefresh(), 500);

        return updatedChoice.data!;
      }

      console.log("Place already exists in options:", googlePlaceId);
      return incompleteChoice; // Return existing choice if place ID already exists
    }

    console.log("Creating new choice with place:", googlePlaceId);
    const createdChoice = await client.models.Choice.create({
      selectedPlaceId: "NONE",
      optionPlaceIds: [googlePlaceId],
    });

    console.log("Choice created successfully:", createdChoice.data);

    // Verify the creation worked
    const verifyChoice = await client.models.Choice.get({
      id: createdChoice.data!.id,
    });
    console.log("Verified created choice:", verifyChoice.data);

    // Trigger refresh to update UI
    setTimeout(() => triggerRefresh(), 500);

    return createdChoice.data!;
  } catch (error) {
    console.error("Error creating/updating choice:", error);
    throw error;
  }
};

export const selectChoice = async (
  choice: ChoiceEntity,
  selectionPlaceId: string,
): Promise<ChoiceEntity> => {
  try {
    console.log("Selecting choice:", { choice, selectionPlaceId });
    const updatedChoice = await client.models.Choice.update({
      id: choice.id,
      selectedPlaceId: selectionPlaceId,
    });

    console.log("Choice selected successfully:", updatedChoice.data);

    // Trigger refresh to update UI
    setTimeout(() => triggerRefresh(), 500);

    return updatedChoice.data!;
  } catch (error) {
    console.error("Error selecting choice:", error);
    throw error;
  }
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

export const createPreferencesListener = (
  fn: (preferences: PreferencesEntity) => void,
) => {
  const listener = client.models.Preferences.onCreate().subscribe({
    next: async (preferences: Schema["Preferences"]["type"]) => {
      fn(preferences);
    },
    error: (error: Error) => {
      console.error("Subscription error", error);
    },
  });
  return listener;
};

export const updatePreferencesListener = (
  fn: (preferences: PreferencesEntity) => void,
) => {
  const listener = client.models.Preferences.onUpdate().subscribe({
    next: async (preferences: Schema["Preferences"]["type"]) => {
      fn(preferences);
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
