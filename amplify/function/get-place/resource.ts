import { defineFunction } from "@aws-amplify/backend";

export const getPlaceFunction = defineFunction({
  name: "get-google-place",
  entry: "../get-place.ts",
  timeoutSeconds: 600,
});
