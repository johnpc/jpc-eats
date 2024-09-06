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

// eslint-disable-next-line @typescript-eslint/ban-types
const underlyingAuthLambda = backend.authFunction.resources.lambda as Function;
underlyingAuthLambda.addEnvironment(
  "ADMIN_API_KEY",
  process.env.ADMIN_API_KEY!,
);

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
