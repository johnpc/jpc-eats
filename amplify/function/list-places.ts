import { LambdaFunctionURLEvent } from "aws-lambda";
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const bodyJson = JSON.parse(event.body ?? "{}");
  const latitude = bodyJson.latitude;
  const longitude = bodyJson.longitude;
  const sort: "DISTANCE" | "POPULARITY" | undefined =
    bodyJson.sort ?? "DISTANCE";

  const placesApiResponse = await fetch(GOOGLE_PLACES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask":
        "places.id,places.name,places.types,places.nationalPhoneNumber,places.formattedAddress,places.websiteUri,places.regularOpeningHours,places.priceLevel,places.iconBackgroundColor,places.displayName,places.primaryTypeDisplayName,places.takeout,places.delivery,places.dineIn,places.currentOpeningHours,places.primaryType,places.shortFormattedAddress,places.editorialSummary,places.outdoorSeating,places.servesCocktails,places.allowsDogs,places.goodForGroups,places.goodForWatchingSports,places.photos,places.generativeSummary,places.iconMaskBaseUri",
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY!,
    },
    body: JSON.stringify({
      includedTypes: ["restaurant"],
      languageCode: "en",
      rankPreference: sort,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          // radius: 16093, // ten miles
          // radius: 8000, // ~five miles
          radius: 4000, // ~2.5 miles
        },
      },
    }),
  });

  const placesApiResponseJson = await placesApiResponse.json();
  console.log({ placesApiResponseJson });

  const response = {
    statusCode: 200,
    body: JSON.stringify(placesApiResponseJson),
  };

  return response;
};
