import crypto from "crypto";
const NUM_PLACES_PER_PAGE = 20;
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchText";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { getImageBase64 } from "./get-place-image";
import { env } from "$amplify/env/search-google-places";
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

export const handler: Schema["searchGooglePlaces"]["functionHandler"] = async (
  event,
) => {
  console.log({ event });
  const latitude = event.arguments.latitude.toFixed(3);
  const longitude = event.arguments.longitude.toFixed(3);
  const openNow = event.arguments.openNow ? true : false;
  const search = event.arguments.search;
  const md5 = crypto
    .createHash("md5")
    .update(
      JSON.stringify({
        latitude,
        longitude,
        openNow,
        search,
        NUM_PLACES_PER_PAGE,
      }),
    )
    .digest("hex");

  console.log({
    md5,
    source: JSON.stringify({
      latitude,
      longitude,
      openNow,
      search,
      NUM_PLACES_PER_PAGE,
    }),
  });
  const googleApiCache = await client.graphql({
    query: listGoogleApiCacheByHash,
    variables: {
      hash: md5,
    },
  });

  const hashMatch = googleApiCache.data?.listGoogleApiCacheByHash?.items.find(
    (r) => r,
  );
  console.log({ hashMatch });
  if (hashMatch) {
    console.log("Returning from cache");
    const response = {
      ...JSON.parse(hashMatch.value),
      fromCache: true,
      cacheKey: md5,
      source: JSON.stringify({
        latitude,
        longitude,
        openNow,
        search,
        NUM_PLACES_PER_PAGE,
      }),
    };

    return response.places;
  }

  let nextPageToken: string | undefined = undefined;
  let places: { id: string }[] = [];
  const placesApiResponse = await fetch(GOOGLE_PLACES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask":
        "places.id,places.name,places.types,places.nationalPhoneNumber,places.formattedAddress,places.websiteUri,places.regularOpeningHours,places.priceLevel,places.iconBackgroundColor,places.displayName,places.primaryTypeDisplayName,places.takeout,places.delivery,places.dineIn,places.currentOpeningHours,places.primaryType,places.shortFormattedAddress,places.editorialSummary,places.outdoorSeating,places.servesCocktails,places.allowsDogs,places.goodForGroups,places.goodForWatchingSports,places.photos,places.generativeSummary,places.iconMaskBaseUri,nextPageToken",
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY!,
    },
    body: JSON.stringify({
      pageToken: nextPageToken,
      textQuery: search ?? "food",
      locationBias: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 500.0,
        },
      },
      pageSize: NUM_PLACES_PER_PAGE,
      openNow: openNow,
      languageCode: "en",
    }),
  });

  const placesApiResponseJson: {
    places: { id: string; photos: { name: string }[]; images: string[] }[];
    nextPageToken: string;
  } = await placesApiResponse.json();

  console.log({ placesApiResponseJson });

  const hydratedPlacePromises = (placesApiResponseJson.places ?? []).map(
    async (place) => {
      const imagePromises = (place.photos ?? []).map(async (photo) => {
        try {
          return await getImageBase64(photo.name);
        } catch (e) {
          console.log("Failed to getImageBase64 for " + place.photos[0].name);
          console.warn(e);
        }
      });
      await Promise.all(imagePromises);
      return place;
    },
  );
  const hydratedPlaces = await Promise.all(hydratedPlacePromises);
  console.log({ hydratedPlaces });
  places = places.concat(hydratedPlaces);
  nextPageToken = placesApiResponseJson.nextPageToken;

  const resultString = JSON.stringify({
    places,
    fromCache: false,
    cacheKey: md5,
    source: JSON.stringify({
      latitude,
      longitude,
      openNow,
      search,
      NUM_PLACES_PER_PAGE,
    }),
  });

  const createdGoogleApiCache = await client.graphql({
    query: createGoogleApiCache,
    variables: {
      input: {
        hash: md5,
        value: resultString,
      },
    },
  });
  console.log({ createdGoogleApiCache });

  const allCacheItemsPromises = places.map(async (place) => {
    const createdGoogleSearchApiCache = await client.graphql({
      query: createGoogleApiCache,
      variables: {
        input: {
          hash: place.id,
          source: JSON.stringify({
            latitude,
            longitude,
            openNow,
            search,
            NUM_PLACES_PER_PAGE,
          }),
          value: JSON.stringify(place),
        },
      },
    });
    console.log({ createdGoogleSearchApiCache });
  });
  await Promise.all(allCacheItemsPromises);

  return places;
};
