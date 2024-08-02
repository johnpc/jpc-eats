import { Tabs } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
  PreferencesEntity,
  RotationEntity,
} from "../entities";
import { OptionsPage } from "./OptionsPage";
import SettingsPage from "./SettingsPage";
import { RotationPage } from "./RotationPage";
import { PlaceSearchPage } from "./PlaceSearchPage";

export default function TabsView(props: {
  user: AuthUser;
  youAreHere: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
  loading: boolean;
}) {
  return (
    <>
      <Tabs
        justifyContent="flex-start"
        spacing="equal"
        defaultValue="Search"
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
