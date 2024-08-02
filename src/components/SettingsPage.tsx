import {
  AccountSettings,
  Card,
  Divider,
  Heading,
  Link,
} from "@aws-amplify/ui-react";
import SignOutButton from "./SettingsPage/SignOutButton";
import { AuthUser } from "aws-amplify/auth";
import { PreferencesEntity } from "../entities";
import Preferences from "./SettingsPage/Preferences";

export default function SettingsPage(props: {
  user: AuthUser;
  preferences: PreferencesEntity;
}) {
  const handleSuccess = () => {
    alert("success!");
  };

  return (
    <Card>
      <Heading>{props.user.signInDetails?.loginId}</Heading>
      <Preferences preferences={props.preferences} />
      <AccountSettings.ChangePassword onSuccess={handleSuccess} />
      <Divider style={{ margin: "20px" }} />
      <SignOutButton />
      <Divider style={{ margin: "20px" }} />
      <AccountSettings.DeleteUser onSuccess={handleSuccess} />
      <Card>
        For support, send an email to{" "}
        <Link href="mailto:john@johncorser.com">john@johncorser.com</Link>
      </Card>
    </Card>
  );
}
