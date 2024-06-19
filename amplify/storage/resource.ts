import { defineStorage } from "@aws-amplify/backend";
import { getPlaceImageFunction } from "../function/get-place-image/resource";
import { getPlaceImageV1Function } from "../function/get-place-image-v1/resource";
import { searchPlacesFunction } from "../function/search-places/resource";
import { getPlaceFunction } from "../function/get-place/resource";

export const storage = defineStorage({
  name: "jpcEatsResources",
  access: (allow) => ({
    "public/*": [
      allow.resource(getPlaceFunction).to(["read", "write"]),
      allow.resource(searchPlacesFunction).to(["read", "write"]),
      allow.resource(getPlaceImageFunction).to(["read", "write"]),
      allow.resource(getPlaceImageV1Function).to(["read", "write"]),
    ],
  }),
});
