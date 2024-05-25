import { LambdaFunctionURLEvent } from "aws-lambda";
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const bodyJson = JSON.parse(event.body ?? "{}");
  const latitude = bodyJson.latitude;
  const longitude = bodyJson.longitude;

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

  const response = {
    statusCode: 200,
    body: JSON.stringify({ results: allPlaces }),
  };

  return response;
};
