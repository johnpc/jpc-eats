import { LambdaFunctionURLEvent } from "aws-lambda";
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1/places";

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const placeId = event.queryStringParameters?.placeId;
  const url = `${GOOGLE_PLACES_API_URL}/${placeId}?key=${GOOGLE_PLACES_API_KEY}&fields=id,name,types,nationalPhoneNumber,formattedAddress,websiteUri,regularOpeningHours,priceLevel,iconBackgroundColor,displayName,primaryTypeDisplayName,takeout,delivery,dineIn,currentOpeningHours,primaryType,shortFormattedAddress,editorialSummary,outdoorSeating,servesCocktails,allowsDogs,goodForGroups,goodForWatchingSports,photos,generativeSummary,iconMaskBaseUri&languageCode=en`;
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

  const response = {
    statusCode: 200,
    body: JSON.stringify(placeApiResponseJson),
  };

  return response;
};
