import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { AmplifyFunction, ConstructFactory } from "@aws-amplify/plugin-types";

const schema = a.schema({
  GoogleApiCache: a
    .model({
      hash: a.string().required(),
      value: a.string().required(),
    })
    .secondaryIndexes((index) => [index("hash")])
    .authorization((allow) => [
      allow.custom(),
      allow.owner(),
      allow.authenticated(),
      allow.guest(),
    ]),
  Rotation: a
    .model({
      googlePlaceId: a.string().required(),
    })
    .authorization((allow) => [allow.owner(), allow.custom()]),
  Choice: a
    .model({
      optionPlaceIds: a.string().array().required(),
      selectedPlaceId: a.string(),
    })
    .secondaryIndexes((index) => [index("selectedPlaceId")])
    .authorization((allow) => [allow.owner(), allow.custom()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = (authFunction: ConstructFactory<AmplifyFunction>) =>
  defineData({
    schema,
    authorizationModes: {
      defaultAuthorizationMode: "userPool",
      lambdaAuthorizationMode: {
        function: authFunction,
        timeToLiveInSeconds: 300,
      },
    },
  });
