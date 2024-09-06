import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { AmplifyFunction, ConstructFactory } from "@aws-amplify/plugin-types";
import { getPlaceFunction } from "../function/get-place/resource";
import { searchPlacesFunction } from "../function/search-places/resource";
import { getPlaceImageFunction } from "../function/get-place-image/resource";
const schema = a
  .schema({
    GoogleApiCache: a
      .model({
        hash: a.string().required(),
        value: a.string().required(),
        source: a.string(),
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
    Preferences: a
      .model({
        compactMode: a.boolean(),
      })
      .authorization((allow) => [allow.owner(), allow.custom()]),
    GooglePlaceImage: a.customType({
      name: a.string().required(),
      photoUri: a.string().required(),
      fromCache: a.boolean().required(),
    }),
    GooglePlaceText: a.customType({
      text: a.string(),
      languageCode: a.string(),
    }),
    GooglePlace: a.customType({
      id: a.string().required(),
      name: a.string().required(),
      photos: a.string().array(),
      websiteUri: a.string(),
      displayName: a.ref("GooglePlaceText").required(),
      generativeSummary: a.ref("GooglePlaceText"),
      editorialSummary: a.ref("GooglePlaceText"),
    }),
    searchGooglePlaces: a
      .query()
      .arguments({
        latitude: a.float().required(),
        longitude: a.float().required(),
        openNow: a.boolean(),
        search: a.string(),
      })
      .returns(a.ref("GooglePlace").array().required())
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(searchPlacesFunction)),
    getGooglePlace: a
      .query()
      .arguments({
        placeId: a.string().required(),
      })
      .returns(a.ref("GooglePlace"))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(getPlaceFunction)),
    getGooglePlaceImage: a
      .query()
      .arguments({
        photoId: a.string().required(),
        widthPx: a.integer(),
        heightPx: a.integer(),
      })
      .returns(a.ref("GooglePlaceImage"))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(getPlaceImageFunction)),
  })
  .authorization((allow) => [
    allow.resource(searchPlacesFunction).to(["query", "mutate", "listen"]),
    allow.resource(getPlaceFunction).to(["query", "mutate", "listen"]),
  ]);

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
