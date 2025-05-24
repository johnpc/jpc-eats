import { Tabs } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, PreferencesEntity, RotationEntity } from "../entities";
import { OptionsPage } from "./OptionsPage";
import SettingsPage from "./SettingsPage";
import { RotationPage } from "./RotationPage";
import { PlaceSearchPage } from "./PlaceSearchPage";

export default function TabsView(props: {
  user: AuthUser;
  youAreHere: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
  refreshData: () => Promise<any>;
}) {
  return (
    <>
      <Tabs
        justifyContent="flex-start"
        spacing="equal"
        defaultValue="Search"
        onChange={(nextTab) => {
          // Refresh data when switching tabs to ensure latest data
          console.log("Tab changed to:", nextTab);
          props.refreshData();
        }}
        items={[
          {
            label: "Search",
            value: "Search",
            content: <PlaceSearchPage {...props} />,
          },
          {
            label: "Rotation",
            value: "Rotation",
            content: <RotationPage {...props} />,
          },
          {
            label: "Options",
            value: "Options",
            content: <OptionsPage {...props} />,
          },
          {
            label: "Settings",
            value: "Settings",
            content: <SettingsPage {...props} />,
          },
        ]}
      />
    </>
  );
}
