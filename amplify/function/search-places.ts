import { LambdaFunctionURLEvent } from "aws-lambda";
import crypto from "crypto";
const NUM_PLACES_PER_PAGE = 20;
const { GOOGLE_PLACES_API_KEY, ADMIN_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchText";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource";
import { getImageBase64 } from "./get-place-image";
Amplify.configure(config);
const client = generateClient<Schema>({
  authMode: "lambda",
  authToken: ADMIN_API_KEY,
});

const handleEvent = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const bodyJson = JSON.parse(event.body ?? "{}");
  const latitude = parseFloat(bodyJson.latitude).toFixed(3);
  const longitude = parseFloat(bodyJson.longitude).toFixed(3);
  const openNow = bodyJson.openNow ? true : false;
  const search: string | undefined = bodyJson.search;
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
  const googleApiCache =
    await client.models.GoogleApiCache.listGoogleApiCacheByHash({ hash: md5 });
  const hashMatch = googleApiCache.data?.find((r) => r);
  console.log({ hashMatch });
  if (hashMatch) {
    console.log("Returning from cache");
    const response = {
      statusCode: 200,
      body: JSON.stringify({
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
      }),
    };

    return response;
  }

  let nextPageToken: string | undefined = undefined;
  let places: { id: string }[] = [];
  // do {
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
      // console.log({images});
      // place.images = images;

      // console.log({placePhotoName: place.photos[0].name});
      // try {
      //   await getImageBase64(place.photos[0].name);
      // }
      // catch (e) {
      //   console.log("Failed to getImageBase64 for " + place.photos[0].name)
      //   console.warn(e);
      // }
      // place.images = [imageBase64];

      return place;
    },
  );
  const hydratedPlaces = await Promise.all(hydratedPlacePromises);
  console.log({ hydratedPlaces });
  places = places.concat(hydratedPlaces);
  // places.push(...hydratedPlaces);
  nextPageToken = placesApiResponseJson.nextPageToken;
  // } while (nextPageToken);

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

  const response = {
    statusCode: 200,
    body: resultString,
  };

  const createdGoogleApiCache = await client.models.GoogleApiCache.create({
    hash: md5,
    value: resultString,
  });
  console.log({ createdGoogleApiCache });

  const allCacheItemsPromises = places.map(async (place) => {
    await client.models.GoogleApiCache.create({
      hash: place.id,
      source: JSON.stringify({
        latitude,
        longitude,
        openNow,
        search,
        NUM_PLACES_PER_PAGE,
      }),
      value: JSON.stringify(place),
    });
  });
  await Promise.all(allCacheItemsPromises);

  return response;
};

export const handler = async (event: LambdaFunctionURLEvent) => {
  try {
    return await handleEvent(event);
  } catch (e) {
    console.error(e);
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        errorMessage: (e as Error).message,
      }),
    };
    return response;
  }
};
