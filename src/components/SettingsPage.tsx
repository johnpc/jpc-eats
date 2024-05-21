import { AccountSettings, Card, Divider, Heading } from "@aws-amplify/ui-react";
import SignOutButton from "./SettingsPage/SignOutButton";
import { AuthUser } from "aws-amplify/auth";

export default function SettingsPage(props: { user: AuthUser }) {
  const handleSuccess = () => {
    alert("success!");
  };

  return (
    <Card>
      <Heading>{props.user.signInDetails?.loginId}</Heading>
      <AccountSettings.ChangePassword onSuccess={handleSuccess} />
      <Divider style={{ margin: "20px" }} />
      <SignOutButton />
      <Divider style={{ margin: "20px" }} />
      <AccountSettings.DeleteUser onSuccess={handleSuccess} />
    </Card>
  );
}
