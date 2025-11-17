import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { SearchPage } from "./SearchPage";
import { RotationPage } from "./RotationPage";
import { OptionsPage } from "./OptionsPage";
import { StatsPage } from "./StatsPage";
import { SettingsPage } from "./SettingsPage";

export function TabsView() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Search" />
        <Tab label="Rotation" />
        <Tab label="Options" />
        <Tab label="Stats" />
        <Tab label="Settings" />
      </Tabs>
      <Box sx={{ p: 2 }}>
        {tab === 0 && <SearchPage />}
        {tab === 1 && <RotationPage />}
        {tab === 2 && <OptionsPage />}
        {tab === 3 && <StatsPage />}
        {tab === 4 && <SettingsPage />}
      </Box>
    </Box>
  );
}
