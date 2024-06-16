import { defineBackend, defineFunction } from "@aws-amplify/backend";
import { Function, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { CfnMap } from "aws-cdk-lib/aws-location";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { getPlaceImageV1Function } from "./function/get-place-image-v1/resource";
import { getPlaceImageFunction } from "./function/get-place-image/resource";
import dotenv from "dotenv";
dotenv.config();

const searchPlacesFunction = defineFunction({
  entry: "./function/search-places.ts",
  timeoutSeconds: 600,
});
const getPlaceFunction = defineFunction({
  entry: "./function/get-place.ts",
  timeoutSeconds: 600,
});
const listAllPlacesFunction = defineFunction({
  entry: "./function/list-all-places.ts",
  timeoutSeconds: 60,
});
const listPlacesFunction = defineFunction({
  entry: "./function/list-places.ts",
});
const authFunction = defineFunction({
  entry: "./data/custom-authorizer.ts",
});

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  getPlaceFunction,
  searchPlacesFunction,
  getPlaceImageV1Function,
  listAllPlacesFunction,
  getPlaceImageFunction,
  authFunction,
  listPlacesFunction,
  auth,
  storage,
  data: data(authFunction),
});

// eslint-disable-next-line @typescript-eslint/ban-types
const underlyingAuthLambda = backend.authFunction.resources.lambda as Function;
underlyingAuthLambda.addEnvironment(
  "ADMIN_API_KEY",
  process.env.ADMIN_API_KEY!,
);

const outputs = {} as { [key: string]: string };
[
  { name: "listAllPlacesFunction" },
  { name: "listPlacesFunction" },
  { name: "getPlaceImageFunction" },
  { name: "getPlaceImageV1Function" },
  { name: "searchPlacesFunction" },
  { name: "getPlaceFunction" },
].forEach((functionInfo) => {
  const underlyingLambda =
    // eslint-disable-next-line
    (backend as any)[functionInfo.name].resources.lambda as Function;
  underlyingLambda.addEnvironment("ADMIN_API_KEY", process.env.ADMIN_API_KEY!);
  underlyingLambda.addEnvironment(
    "GOOGLE_PLACES_API_KEY",
    process.env.GOOGLE_PLACES_API_KEY!,
  );

  const functionUrl = underlyingLambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
    },
  });
  outputs[functionInfo.name] = functionUrl.url;
});

backend.addOutput({
  custom: outputs,
});

const geoStack = backend.createStack("geo-stack");

// create a location services map
const map = new CfnMap(geoStack, "Map", {
  mapName: process.env.MAP_NAME!,
  description: "Map",
  configuration: {
    style: "VectorEsriNavigation",
  },
  pricingPlan: "RequestBasedUsage",
  tags: [
    {
      key: "name",
      value: process.env.MAP_NAME!,
    },
  ],
});

// create an IAM policy to allow interacting with geo resource
const myGeoPolicy = new Policy(geoStack, "GeoPolicy", {
  policyName: "myGeoPolicy",
  statements: [
    new PolicyStatement({
      actions: [
        "geo:GetMapTile",
        "geo:GetMapSprites",
        "geo:GetMapGlyphs",
        "geo:GetMapStyleDescriptor",
      ],
      resources: [map.attrArn],
    }),
  ],
});

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myGeoPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  myGeoPolicy,
);

// patch the map resource to the expected output configuration
backend.addOutput({
  geo: {
    aws_region: geoStack.region,
    maps: {
      items: {
        [map.mapName]: {
          style: "VectorEsriNavigation",
        },
      },
      default: map.mapName,
    },
  },
});
