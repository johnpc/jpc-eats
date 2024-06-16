import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import crypto from "crypto";
import { getUrl, uploadData } from "aws-amplify/storage";

const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL =
  "https://maps.googleapis.com/maps/api/place/photo";

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });

  const photoId = event.queryStringParameters?.photoId;
  const widthPx = event.queryStringParameters?.widthPx;

  const url = `${GOOGLE_PLACES_API_URL}?maxwidth=${widthPx}&photo_reference=${photoId}&key=${GOOGLE_PLACES_API_KEY}`;

  console.log({ url });
  const md5 = crypto
    .createHash("md5")
    .update(
      JSON.stringify({
        url,
      }),
    )
    .digest("hex");
  try {
    const linkToStorageFile = await getUrl({
      path: `${md5}.jpg`,
      options: {
        validateObjectExistence: true,
      },
    });
    const response: LambdaFunctionURLResult = {
      statusCode: 200,
      body: JSON.stringify({
        imageUrl: linkToStorageFile.url,
        fromCache: true,
      }),
    };

    return response;
  } catch {
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

    try {
      const bytes = await fetch(imageUrl);
      const result = await uploadData({
        path: `${md5}.jpg`,
        data: await bytes.blob(),
      }).result;
      console.log("Succeeded: ", result);
    } catch (error) {
      console.log("Error : ", error);
    }

    const response: LambdaFunctionURLResult = {
      statusCode: 200,

      body: JSON.stringify({ imageUrl }),
    };

    return response;
  }
};
