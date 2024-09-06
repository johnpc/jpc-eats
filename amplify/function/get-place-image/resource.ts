import { defineFunction } from "@aws-amplify/backend";

export const getPlaceImageFunction = defineFunction({
  name: "get-google-place-image",
  entry: "../get-place-image.ts",
});
