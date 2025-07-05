import {
  AccountSettings,
  Card,
  Divider,
  Heading,
  Link,
} from "@aws-amplify/ui-react";
import SignOutButton from "./SettingsPage/SignOutButton";
import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, PreferencesEntity } from "../entities";
import Preferences from "./SettingsPage/Preferences";
import StatsPage from "./StatsPage";

export default function SettingsPage(props: {
  user: AuthUser | null;
  preferences: PreferencesEntity;
  choices: ChoiceEntity[];
}) {
  const handleSuccess = () => {
    alert("success!");
  };

  return (
    <>
    <Card>
      {props.user && (
        <>
          <Heading>{props.user.signInDetails?.loginId}</Heading>
          <AccountSettings.ChangePassword onSuccess={handleSuccess} />
          <Divider style={{ margin: "20px" }} />
          <AccountSettings.DeleteUser onSuccess={handleSuccess} />
          <Divider style={{ margin: "20px" }} />
        </>
      )}
      <Preferences preferences={props.preferences} />
      <Divider style={{ margin: "20px" }} />
      <SignOutButton />
      <Card>
        For support, send an email to{" "}
        <Link href="mailto:john@johncorser.com">john@johncorser.com</Link>
      </Card>
    </Card>
    <StatsPage choices={props.choices} />
    </>
  );
}
