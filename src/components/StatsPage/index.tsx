import { useState } from "react";
import { Heading, Message, Button, Loader, useTheme, Tabs } from "@aws-amplify/ui-react";
import { useAuth } from "../../hooks/useAuth";
import { useChoices } from "../../hooks/useChoices";
import { AuthModal } from "../AuthModal";
import { StatsChart } from "./StatsChart";
import { HistoryList } from "./HistoryList";

export function StatsPage() {
  const { tokens } = useTheme();
  const { user } = useAuth();
  const { data: choices = [], isLoading } = useChoices();
  const [showAuth, setShowAuth] = useState(false);

  const completedChoices = choices.filter(
    (c) => c.selectedPlaceId && c.selectedPlaceId !== "NONE"
  );

  if (!user) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Statistics</Heading>
        <Message variation="outlined" colorTheme="info" heading="Not Logged In">
          Sign in to see your dining statistics and selection history.
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
        <Heading marginBottom={tokens.space.xs}>Statistics</Heading>
        <Loader />
      </>
    );
  }

  if (completedChoices.length === 0) {
    return (
      <>
        <Heading marginBottom={tokens.space.xs}>Statistics</Heading>
        <Message variation="outlined" colorTheme="warning" heading="No History Yet">
          You haven't made any selections yet. Nominate options and select one to start building
          your dining history!
        </Message>
      </>
    );
  }

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Statistics</Heading>
      <Tabs.Container defaultValue="stats">
        <Tabs.List>
          <Tabs.Item value="stats">Stats</Tabs.Item>
          <Tabs.Item value="history">History</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="stats">
          <StatsChart choices={completedChoices} />
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <HistoryList choices={completedChoices} />
        </Tabs.Panel>
      </Tabs.Container>
    </>
  );
}
