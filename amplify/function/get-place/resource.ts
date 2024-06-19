import { defineFunction } from "@aws-amplify/backend";

export const getPlaceFunction = defineFunction({
  entry: "../get-place.ts",
  timeoutSeconds: 600,
});
