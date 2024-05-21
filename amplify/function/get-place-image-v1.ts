import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/photo";

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });

  const photoId = event.queryStringParameters?.photoId;
  const widthPx = event.queryStringParameters?.widthPx;

  const url = `${GOOGLE_PLACES_API_URL}?maxwidth=${widthPx}&photo_reference=${photoId}&key=${GOOGLE_PLACES_API_KEY}`;

  console.log({ url });
  const placesApiResponse = await fetch(url, {
    method: "GET",
    redirect: "manual",
  });

  console.log({ placesApiResponse });
  const placesApiResponseImage = await placesApiResponse.text();
  console.log({ placesApiResponseImage });
  const imageUrl = (
    placesApiResponseImage?.match(/A HREF="(.*)">/) as string[]
  )[1];

  const response: LambdaFunctionURLResult = {
    statusCode: 200,

    body: JSON.stringify({ imageUrl }),
  };

  return response;
};
