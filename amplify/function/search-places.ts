import { LambdaFunctionURLEvent } from "aws-lambda";
const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://places.googleapis.com/v1/places:searchText";

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const bodyJson = JSON.parse(event.body ?? "{}");
  const latitude = bodyJson.latitude;
  const longitude = bodyJson.longitude;
  const openNow = bodyJson.openNow ? true : false;
  const search: string | undefined = bodyJson.search;

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

  const response = {
    statusCode: 200,
    body: JSON.stringify({ places }),
  };

  return response;
};
