import { defineBackend, defineFunction } from "@aws-amplify/backend";
import { Function } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { getPlaceImageFunction } from "./function/get-place-image/resource";
import { searchPlacesFunction } from "./function/search-places/resource";
import { getPlaceFunction } from "./function/get-place/resource";
import dotenv from "dotenv";
dotenv.config();

const authFunction = defineFunction({
  entry: "./data/custom-authorizer.ts",
});

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  getPlaceFunction,
  searchPlacesFunction,
  getPlaceImageFunction,
  authFunction,
  auth,
  storage,
  data: data(authFunction),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const underlyingAuthLambda = backend.authFunction.resources.lambda as any;
underlyingAuthLambda.addEnvironment(
  "ADMIN_API_KEY",
  process.env.ADMIN_API_KEY!,
);

// Set refresh token validity to maximum (10 years)
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.userPoolAddOns = { advancedSecurityMode: "OFF" };
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    requireUppercase: false,
  },
};

const { cfnUserPoolClient } = backend.auth.resources.cfnResources;
cfnUserPoolClient.refreshTokenValidity = 3650; // 10 years (max)
cfnUserPoolClient.accessTokenValidity = 1; // 1 day
cfnUserPoolClient.idTokenValidity = 1; // 1 day
cfnUserPoolClient.tokenValidityUnits = {
  refreshToken: "days",
  accessToken: "days",
  idToken: "days",
};

// const outputs = {} as { [key: string]: string };
[
  { name: "getPlaceImageFunction" },
  { name: "searchPlacesFunction" },
  { name: "getPlaceFunction" },
].forEach((functionInfo) => {
  const underlyingLambda =
    // eslint-disable-next-line
    (backend as any)[functionInfo.name].resources.lambda as Function;
  // underlyingLambda.addEnvironment("ADMIN_API_KEY", process.env.ADMIN_API_KEY!);
  underlyingLambda.addEnvironment(
    "GOOGLE_PLACES_API_KEY",
    process.env.GOOGLE_PLACES_API_KEY!,
  );

  // const functionUrl = underlyingLambda.addFunctionUrl({
  //   authType: FunctionUrlAuthType.NONE,
  //   cors: {
  //     allowedOrigins: ["*"],
  //     allowedHeaders: ["*"],
  //   },
  // });
  // outputs[functionInfo.name] = functionUrl.url;
});

// backend.addOutput({
//   custom: outputs,
// });
