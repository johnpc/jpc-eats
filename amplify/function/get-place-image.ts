import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1";

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });

  const photoId = event.queryStringParameters?.photoId;
  const widthPx = event.queryStringParameters?.widthPx;
  const heightPx = event.queryStringParameters?.heightPx;
  const url = `${GOOGLE_PLACES_API_URL}/${photoId}/media?maxHeightPx=${heightPx}&maxWidthPx=${widthPx}&key=${GOOGLE_PLACES_API_KEY}`;

  console.log({ url });
  const placesApiResponse = await fetch(url, {
    method: "GET",
    redirect: "manual",
  });

  console.log({ placesApiResponse });
  const placesApiResponseImage = await placesApiResponse.json();
  console.log({ placesApiResponseImage });
  const response: LambdaFunctionURLResult = {
    statusCode: 200,
    body: JSON.stringify(placesApiResponseImage),
  };

  return response;
};
