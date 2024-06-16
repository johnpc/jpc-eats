import { defineStorage } from "@aws-amplify/backend";
import { getPlaceImageFunction } from "../function/get-place-image/resource";
import { getPlaceImageV1Function } from "../function/get-place-image-v1/resource";

export const storage = defineStorage({
  name: "jpcEatsResources",
  access: (allow) => ({
    "public/*": [
      allow.resource(getPlaceImageFunction).to(["read", "write"]),
      allow.resource(getPlaceImageV1Function).to(["read", "write"]),
    ],
  }),
});
