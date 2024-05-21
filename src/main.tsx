// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "@aws-amplify/ui-react/styles.css";
import "@aws-amplify/ui-react-geo/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "./index.css";
import config from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { ThemeProvider, Theme } from "@aws-amplify/ui-react";
Amplify.configure(config);

const theme: Theme = {
  name: "my-theme",
  primaryColor: "orange",
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
