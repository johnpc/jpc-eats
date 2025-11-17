import { useState } from "react";
import { Heading, Message, Button, Loader, useTheme } from "@aws-amplify/ui-react";
import { useAuth } from "../../hooks/useAuth";
import { useChoices } from "../../hooks/useChoices";
import { AuthModal } from "../AuthModal";
import { OptionsList } from "./OptionsList";

export function OptionsPage() {
  const { tokens } = useTheme();
  const { user } = useAuth();
  const { data: choices = [], isLoading } = useChoices();
  const [showAuth, setShowAuth] = useState(false);

  const currentChoice = choices.find((c) => !c.selectedPlaceId || c.selectedPlaceId === "NONE");

  if (!user) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Current Options</Heading>
        <Message variation="outlined" colorTheme="info" heading="Not Logged In">
          Sign in to nominate restaurants and see your current options.
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
        <Heading marginBottom={tokens.space.xs}>Current Options</Heading>
        <Loader />
      </>
    );
  }

  if (!currentChoice || currentChoice.optionPlaceIds.length === 0) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Current Options</Heading>
        <Message variation="outlined" colorTheme="warning" heading="No Options Yet">
          You haven't nominated any options yet. Go to the Rotation tab to choose from your
          favorites, or search for something new and exciting to try!
        </Message>
      </>
    );
  }

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Current Options</Heading>
      <OptionsList placeIds={currentChoice.optionPlaceIds.filter((id): id is string => !!id)} />
    </>
  );
}
