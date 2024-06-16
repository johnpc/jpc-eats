import { defineFunction } from "@aws-amplify/backend";

export const getPlaceImageV1Function = defineFunction({
  entry: "../get-place-image-v1.ts",
});
