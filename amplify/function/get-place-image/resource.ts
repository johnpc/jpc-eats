import { defineFunction } from "@aws-amplify/backend";

export const getPlaceImageFunction = defineFunction({
  entry: "../get-place-image.ts",
});
