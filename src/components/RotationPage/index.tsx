import { useState } from "react";
import { Heading, Message, Button, Loader, useTheme } from "@aws-amplify/ui-react";
import { useAuth } from "../../hooks/useAuth";
import { useRotation } from "../../hooks/useRotation";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { AuthModal } from "../AuthModal";
import { RotationList } from "./RotationList";

export function RotationPage() {
  const { tokens } = useTheme();
  const { user } = useAuth();
  const { data: rotation = [], isLoading } = useRotation();
  const { showAuthModal, closeAuthModal } = useRequireAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!user) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Your Rotation</Heading>
        <Message variation="outlined" colorTheme="info" heading="Not Logged In">
          Sign in to save your favorite restaurants to your rotation. Your saved favorites will
          appear here for quick access.
          <Button onClick={() => setShowAuth(true)} marginTop={tokens.space.small}>
            Login / Create Account
          </Button>
        </Message>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Your Rotation</Heading>
        <Loader />
      </>
    );
  }

  if (rotation.length === 0) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Your Rotation</Heading>
        <Message variation="outlined" colorTheme="warning" heading="No Favorites Yet">
          You haven't added any restaurants to your rotation yet. Go to the Search tab to find
          and save your favorite places!
        </Message>
      </>
    );
  }

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Your Rotation</Heading>
      <RotationList rotation={rotation} />
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
