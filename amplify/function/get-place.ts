import { LambdaFunctionURLEvent } from "aws-lambda";
import crypto from "crypto";
const { GOOGLE_PLACES_API_KEY, ADMIN_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1/places";

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
  const placeId = event.queryStringParameters?.placeId;
  const url = `${GOOGLE_PLACES_API_URL}/${placeId}?key=${GOOGLE_PLACES_API_KEY}&fields=id,name,types,nationalPhoneNumber,formattedAddress,websiteUri,regularOpeningHours,priceLevel,iconBackgroundColor,displayName,primaryTypeDisplayName,takeout,delivery,dineIn,currentOpeningHours,primaryType,shortFormattedAddress,editorialSummary,outdoorSeating,servesCocktails,allowsDogs,goodForGroups,goodForWatchingSports,photos,generativeSummary,iconMaskBaseUri&languageCode=en`;
  const md5 = crypto
    .createHash("md5")
    .update(
      JSON.stringify({
        url,
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
  console.log({ url });
  const placeApiResponse = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY!,
    },
  });
  console.log({ placeApiResponse });

  const placeApiResponseJson: { places: []; nextPageToken: string } =
    await placeApiResponse.json();
  console.log({ placeApiResponseJson });

  const resultString = JSON.stringify(placeApiResponseJson);

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
