const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1/places";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { env } from "$amplify/env/get-google-place";
import { listGoogleApiCacheByHash } from "./queries";
import { createGoogleApiCache } from "./mutations";

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "identityPool",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  },
);
const client = generateClient<Schema>();

export const handler: Schema["getGooglePlace"]["functionHandler"] = async (
  event,
) => {
  console.log({ event });
  const placeId = event.arguments.placeId;
  const url = `${GOOGLE_PLACES_API_URL}/${placeId}?key=${GOOGLE_PLACES_API_KEY}&fields=id,name,types,nationalPhoneNumber,formattedAddress,websiteUri,regularOpeningHours,priceLevel,iconBackgroundColor,displayName,primaryTypeDisplayName,takeout,delivery,dineIn,currentOpeningHours,primaryType,shortFormattedAddress,editorialSummary,outdoorSeating,servesCocktails,allowsDogs,goodForGroups,goodForWatchingSports,photos,generativeSummary,iconMaskBaseUri&languageCode=en`;
  const googleApiCache = await client.graphql({
    query: listGoogleApiCacheByHash,
    variables: {
      hash: placeId!,
    },
  });

  const hashMatch = googleApiCache.data?.listGoogleApiCacheByHash?.items.find(
    (r) => r,
  );
  if (hashMatch) {
    console.log("Returning from cache");
    const response = {
      ...JSON.parse(hashMatch.value),
    };

    return response;
  }
  console.log({ url });
  const placeApiResponse = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY!,
    },
  });
  console.log({ placeApiResponse });

  const placeApiResponseJson: {
    id: string;
    name: string;
    websiteUri: string;
    displayName: { text: string; languageCode: string };
    generativeSummary: { text: string; languageCode: string };
    editorialSummary: { text: string; languageCode: string };
    photos: { name: string }[];
    images: string[];
  } = await placeApiResponse.json();
  console.log({ placeApiResponseJson });

  const resultString = JSON.stringify(placeApiResponseJson);

  const createdGoogleApiCache = await client.graphql({
    query: createGoogleApiCache,
    variables: {
      input: {
        hash: placeId!,
        value: resultString,
      },
    },
  });

  console.log({ createdGoogleApiCache });
  return {
    id: placeApiResponseJson.id,
    name: placeApiResponseJson.name,
    websiteUri: placeApiResponseJson.websiteUri,
    displayName: placeApiResponseJson.displayName,
    generativeSummary: placeApiResponseJson.generativeSummary,
    editorialSummary: placeApiResponseJson.editorialSummary,
  };
};
