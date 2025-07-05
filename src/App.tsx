import { Geolocation, Position } from "@capacitor/geolocation";
import { App as CapacitorApp } from "@capacitor/app";

import { useEffect, useState, useCallback } from "react";
import {
  ChoiceEntity,
  PreferencesEntity,
  RotationEntity,
  createChoiceListener,
  createPreferencesListener,
  createRotationListener,
  deleteRotationListener,
  getPreferences,
  listChoice,
  listRotation,
  triggerRefresh,
  unsubscribeListener,
  updateChoiceListener,
  updatePreferencesListener,
} from "./entities";
import TabsView from "./components/TabsView";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthenticatorModal } from "./components/AuthenticatorModal";

function AppContent() {
  const { user } = useAuth();
  const [lastOpenTime, setLastOpenTime] = useState<Date>();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesEntity>(
    localStorage.getItem("preferences")
      ? JSON.parse(localStorage.getItem("preferences")!)
      : {},
  );
  const [rotation, setRotation] = useState<RotationEntity[]>(
    localStorage.getItem("rotation")
      ? JSON.parse(localStorage.getItem("rotation")!)
      : [],
  );
  const [choices, setChoices] = useState<ChoiceEntity[]>(
    localStorage.getItem("choices")
      ? JSON.parse(localStorage.getItem("choices")!)
      : [],
  );
  const [youAreHere, setYouAreHere] = useState<{
    latitude: number;
    longitude: number;
  }>(
    localStorage.getItem("coordinates")
      ? JSON.parse(localStorage.getItem("coordinates")!)
      : {
          // Default to ann arbor
          latitude: 42.280827,
          longitude: -83.743034,
        },
  );

  console.log({ youAreHere });

  // Add a direct refresh function to force data reload
  const refreshAllData = useCallback(async () => {
    // Only refresh data if user is authenticated
    if (!user) {
      console.log("User not authenticated, skipping data refresh");
      return;
    }

    try {
      console.log("Manually refreshing all data...");
      const [rotationData, choicesData, preferencesData] = await Promise.all([
        listRotation(),
        listChoice(),
        getPreferences(),
      ]);

      console.log("Fresh data received:", {
        rotation: rotationData,
        choices: choicesData,
        preferences: preferencesData,
      });

      setRotation(rotationData);
      setChoices(choicesData);
      setPreferences(preferencesData);

      localStorage.setItem("rotation", JSON.stringify(rotationData));
      localStorage.setItem("choices", JSON.stringify(choicesData));
      localStorage.setItem("preferences", JSON.stringify(preferencesData));

      // Trigger global refresh to update all components
      triggerRefresh();

      console.log("Manual data refresh complete");
      return {
        rotation: rotationData,
        choices: choicesData,
        preferences: preferencesData,
      };
    } catch (error) {
      console.error("Error during manual data refresh:", error);
      throw error;
    }
  }, [user]);

  const requireAuth = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  }, [user]);

  useEffect(() => {
    CapacitorApp.addListener("resume", () => {
      setLastOpenTime(new Date());
      refreshAllData(); // Refresh data when app resumes
    });
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [refreshAllData]);

  useEffect(() => {
    // Only set up subscriptions if user is authenticated
    if (!user) {
      console.log("User not authenticated, skipping subscription setup");
      return;
    }

    const createRotationSubscription = createRotationListener(
      async (rotationItem: RotationEntity) => {
        console.log("Rotation item created:", rotationItem);
        // Use a function to update state based on previous state to avoid race conditions
        setRotation((prevRotation) => {
          // Check if item already exists to prevent duplicates
          if (!prevRotation.some((item) => item.id === rotationItem.id)) {
            const newRotation = [...prevRotation, rotationItem];
            localStorage.setItem("rotation", JSON.stringify(newRotation));
            return newRotation;
          }
          return prevRotation;
        });

        // Force a full refresh to ensure consistency
        setTimeout(() => refreshAllData(), 500);
      },
    );
    const createChoiceSubscription = createChoiceListener(
      async (choiceItem: ChoiceEntity) => {
        console.log("Choice item created:", choiceItem);
        setChoices((prevChoices) => {
          if (!prevChoices.some((item) => item.id === choiceItem.id)) {
            const newChoices = [...prevChoices, choiceItem];
            localStorage.setItem("choices", JSON.stringify(newChoices));
            return newChoices;
          }
          return prevChoices;
        });

        // Force a full refresh to ensure consistency
        setTimeout(() => refreshAllData(), 500);
      },
    );
    const updateChoiceSubscription = updateChoiceListener(
      async (choiceItem: ChoiceEntity) => {
        console.log("Choice item updated:", choiceItem);
        setChoices((prevChoices) => {
          const newChoices = prevChoices.map((choice) =>
            choice.id === choiceItem.id ? choiceItem : choice,
          );
          localStorage.setItem("choices", JSON.stringify(newChoices));
          return newChoices;
        });

        // Force a full refresh to ensure consistency
        setTimeout(() => refreshAllData(), 500);
      },
    );
    const deleteRotationSubscription = deleteRotationListener(
      async (rotationItem: RotationEntity) => {
        console.log("Rotation item deleted:", rotationItem);
        setRotation((prevRotation) => {
          const newRotation = prevRotation.filter(
            (r) => r.id !== rotationItem.id,
          );
          localStorage.setItem("rotation", JSON.stringify(newRotation));
          return newRotation;
        });

        // Force a full refresh to ensure consistency
        setTimeout(() => refreshAllData(), 500);
      },
    );
    const createPreferencesSubscription = createPreferencesListener(
      async (preferences: PreferencesEntity) => {
        console.log("Preferences created:", preferences);
        setPreferences((prevPreferences) => {
          const newPreferences = { ...prevPreferences, ...preferences };
          localStorage.setItem("preferences", JSON.stringify(newPreferences));
          return newPreferences;
        });
      },
    );
    const updatePreferencesSubscription = updatePreferencesListener(
      async (preferences: PreferencesEntity) => {
        console.log("Preferences updated:", preferences);
        setPreferences((prevPreferences) => {
          const newPreferences = { ...prevPreferences, ...preferences };
          localStorage.setItem("preferences", JSON.stringify(newPreferences));
          return newPreferences;
        });
      },
    );

    // Initial data load
    refreshAllData();

    return () => {
      console.log("Unsubscribing from all listeners");
      unsubscribeListener(createRotationSubscription);
      unsubscribeListener(createChoiceSubscription);
      unsubscribeListener(updateChoiceSubscription);
      unsubscribeListener(deleteRotationSubscription);
      unsubscribeListener(createPreferencesSubscription);
      unsubscribeListener(updatePreferencesSubscription);
    };
  }, [lastOpenTime, refreshAllData, user]); // Include user in dependencies

  useEffect(() => {
    const setup = async () => {
      const fetchGeolocation = async () => {
        let coordinates: Position | undefined;
        try {
          coordinates = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            maximumAge: 300000,
            timeout: 5000,
          });
        } catch {
          coordinates = {
            timestamp: Date.now(),
            coords: {
              // Ann Arbor
              latitude: 42.280827,
              longitude: -83.743034,
              accuracy: 0,

              altitudeAccuracy: null,
              altitude: null,
              speed: null,
              heading: null,
            },
          };
        }

        console.log({ coordinates });
        localStorage.setItem("coordinates", JSON.stringify(coordinates));
        setYouAreHere({
          latitude: coordinates!.coords.latitude,
          longitude: coordinates!.coords.longitude,
        });
      };

      await fetchGeolocation();
    };
    setup();
  }, []);

  return (
    <>
      <Header />
      <TabsView
        user={user}
        youAreHere={youAreHere}
        rotation={rotation}
        choices={choices}
        preferences={preferences}
        refreshData={refreshAllData}
        requireAuth={requireAuth}
      />
      <Footer />
      <AuthenticatorModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default App;
