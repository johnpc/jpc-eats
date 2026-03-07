import { defineBackend, defineFunction } from "@aws-amplify/backend";
import { Function, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { getPlaceImageFunction } from "./function/get-place-image/resource";
import { searchPlacesFunction } from "./function/search-places/resource";
import { getPlaceFunction } from "./function/get-place/resource";
import { sendToTeslaFunction } from "./function/send-to-tesla/resource";
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
  sendToTeslaFunction,
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

// Tesla navigation trigger
const teslaLambda = backend.sendToTeslaFunction.resources.lambda as Function;
const choiceTable = backend.data.resources.tables["Choice"];

teslaLambda.addEnvironment("TESSIE_API_KEY", process.env.TESSIE_API_KEY!);
teslaLambda.addEnvironment("TESLA_VIN", process.env.TESLA_VIN!);
teslaLambda.addEnvironment(
  "CACHE_TABLE_NAME",
  backend.data.resources.tables["GoogleApiCache"].tableName,
);
teslaLambda.addEnvironment(
  "ALLOWED_OWNERS",
  [
    "d8d18320-a0f1-7066-4cdd-ef804e08bc4f::d8d18320-a0f1-7066-4cdd-ef804e08bc4f", // John
    "38118380-0031-7066-c041-594d9103a164::38118380-0031-7066-c041-594d9103a164", // Emily
  ].join(","),
);

choiceTable.grantStreamRead(teslaLambda);
backend.data.resources.tables["GoogleApiCache"].grantReadData(teslaLambda);

teslaLambda.addEventSource(
  new DynamoEventSource(choiceTable, {
    startingPosition: StartingPosition.LATEST,
    batchSize: 1,
  }),
);
