import { Tabs, View, Text, Button } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, PreferencesEntity, RotationEntity } from "../entities";
import { OptionsPage } from "./OptionsPage";
import SettingsPage from "./SettingsPage";
import { RotationPage } from "./RotationPage";
import { PlaceSearchPage } from "./PlaceSearchPage";
import { useState } from "react";

// Component to show when authentication is required
const AuthRequiredMessage = ({ onSignIn }: { onSignIn: () => void }) => (
  <View textAlign="center" padding="large">
    <Text fontSize="large" marginBottom="medium">
      Sign in to access this feature
    </Text>
    <Text marginBottom="large">
      You need to be signed in to manage your rotation, options, and settings.
    </Text>
    <Button onClick={onSignIn} variation="primary">
      Sign In
    </Button>
  </View>
);

export default function TabsView(props: {
  user: AuthUser | null;
  youAreHere: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
  refreshData: () => Promise<any>;
  requireAuth: () => boolean;
}) {
  const [currentTab, setCurrentTab] = useState("Search");

  const handleTabChange = (nextTab: string) => {
    // Allow access to Search tab without authentication
    if (nextTab === "Search") {
      setCurrentTab(nextTab);
      return;
    }

    // For other tabs, require authentication
    if (!props.user) {
      props.requireAuth();
      return;
    }

    setCurrentTab(nextTab);
    // Refresh data when switching tabs to ensure latest data
    console.log("Tab changed to:", nextTab);
    props.refreshData();
  };

  return (
    <>
      <Tabs
        justifyContent="flex-start"
        spacing="equal"
        value={currentTab}
        onValueChange={handleTabChange}
        items={[
          {
            label: "Search",
            value: "Search",
            content: <PlaceSearchPage {...props} />,
          },
          {
            label: "Rotation",
            value: "Rotation",
            content: props.user ? (
              <RotationPage {...props} />
            ) : (
              <AuthRequiredMessage onSignIn={props.requireAuth} />
            ),
          },
          {
            label: "Options",
            value: "Options",
            content: props.user ? (
              <OptionsPage {...props} />
            ) : (
              <AuthRequiredMessage onSignIn={props.requireAuth} />
            ),
          },
          {
            label: "Settings",
            value: "Settings",
            content: props.user ? (
              <SettingsPage {...props} />
            ) : (
              <AuthRequiredMessage onSignIn={props.requireAuth} />
            ),
          },
        ]}
      />
    </>
  );
}
