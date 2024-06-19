import { defineFunction } from "@aws-amplify/backend";

export const searchPlacesFunction = defineFunction({
  entry: "../search-places.ts",
  timeoutSeconds: 600,
  runtime: 20,
});
