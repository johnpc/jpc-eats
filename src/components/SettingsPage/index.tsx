import { useState } from "react";
import {
  Heading,
  Card,
  Divider,
  Link,
  AccountSettings,
  Button,
  Message,
  useTheme,
} from "@aws-amplify/ui-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthModal } from "../AuthModal";

export function SettingsPage() {
  const { tokens } = useTheme();
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleSuccess = () => {
    alert("Success!");
  };

  if (!user) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Settings</Heading>
        <Message variation="outlined" colorTheme="info" heading="Not Logged In">
          Sign in to manage your account settings.
          <Button onClick={() => setShowAuth(true)} marginTop={tokens.space.small}>
            Login / Create Account
          </Button>
        </Message>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Settings</Heading>
      <Card>
        <Heading level={5}>{user.signInDetails?.loginId}</Heading>
        <Divider marginTop={tokens.space.medium} marginBottom={tokens.space.medium} />
        
        <AccountSettings.ChangePassword onSuccess={handleSuccess} />
        <Divider marginTop={tokens.space.medium} marginBottom={tokens.space.medium} />
        
        <AccountSettings.DeleteUser onSuccess={handleSuccess} />
        <Divider marginTop={tokens.space.medium} marginBottom={tokens.space.medium} />
        
        <Button isFullWidth variation="destructive" onClick={signOut}>
          Sign Out
        </Button>
        
        <Card marginTop={tokens.space.medium}>
          For support, send an email to{" "}
          <Link href="mailto:john@johncorser.com">john@johncorser.com</Link>
        </Card>
      </Card>
    </>
  );
}
