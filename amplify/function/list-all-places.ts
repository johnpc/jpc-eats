import { LambdaFunctionURLEvent } from "aws-lambda";
import crypto from "crypto";
const { GOOGLE_PLACES_API_KEY, ADMIN_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "../../amplify_outputs.json";
import { Schema } from "../../amplify/data/resource";
Amplify.configure(config);
const client = generateClient<Schema>({
  authMode: "lambda",
  authToken: ADMIN_API_KEY,
});

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const bodyJson = JSON.parse(event.body ?? "{}");
  const latitude = bodyJson.latitude;
  const longitude = bodyJson.longitude;
  const md5 = crypto
    .createHash("md5")
    .update(
      JSON.stringify({
        latitude,
        longitude,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allPlaces: any[] = [];
  let pageToken = undefined;
  do {
    const url: string = `${GOOGLE_PLACES_API_URL}?location=${latitude},${longitude}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}&pagetoken=${pageToken ?? ""}&rankby=distance`;
    console.log({ url });
    const placesApiResponse = await fetch(url, {
      method: "GET",
    });

    const placesApiResponseJson = await placesApiResponse.json();
    console.log({ placesApiResponseJson });

    pageToken = placesApiResponseJson.next_page_token;
    if (pageToken) await sleep(2000);
    allPlaces.push(...placesApiResponseJson.results);
    console.log({ pageToken, length: allPlaces.length });
  } while (pageToken);

  const resultString = JSON.stringify({ results: allPlaces });
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
