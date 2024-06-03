import { LambdaFunctionURLEvent } from "aws-lambda";
import crypto from "crypto";
const { GOOGLE_PLACES_API_KEY, ADMIN_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchText";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource";
Amplify.configure(config);
const client = generateClient<Schema>({
  authMode: "lambda",
  authToken: ADMIN_API_KEY,
});

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const bodyJson = JSON.parse(event.body ?? "{}");
  const latitude = bodyJson.latitude;
  const longitude = bodyJson.longitude;
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
      }),
    )
    .digest("hex");
  const googleApiCache =
    await client.models.GoogleApiCache.listGoogleApiCacheByHash({ hash: md5 });
  const hashMatch = googleApiCache.data?.find((r) => r);
  if (hashMatch) {
    console.log("Returning from cache");
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...JSON.parse(hashMatch.value), fromCache: true }),
    };

    return response;
  }

  let nextPageToken: string | undefined = undefined;
  const places: { id: string }[] = [];
  do {
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
        pageSize: 20,
        openNow: openNow,
        languageCode: "en",
      }),
    });

    const placesApiResponseJson: { places: []; nextPageToken: string } =
      await placesApiResponse.json();
    console.log({ placesApiResponseJson });
    places.push(...placesApiResponseJson.places);
    nextPageToken = placesApiResponseJson.nextPageToken;
  } while (nextPageToken);

  const resultString = JSON.stringify({ places });

  const response = {
    statusCode: 200,
    body: resultString,
  };

  const createdGoogleApiCache = await client.models.GoogleApiCache.create({
    hash: md5,
    value: resultString,
  });
  console.log({ createdGoogleApiCache });

  return response;
};
