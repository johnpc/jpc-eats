import { defineFunction } from "@aws-amplify/backend";

export const sendToTeslaFunction = defineFunction({
  entry: "./handler.ts",
  name: "sendToTesla",
  timeoutSeconds: 30,
  bundling: {
    externalModules: ["@aws-sdk/*"],
  },
});
