import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import crypto from "crypto";
import { env } from "$amplify/env/get-place-image";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const { GOOGLE_PLACES_API_KEY } = process.env;
const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1";
const JPC_EATS_RESOURCES_BUCKET_NAME = env.JPC_EATS_RESOURCES_BUCKET_NAME;

const getPresignedUrl = async (key: string) => {
  const client = new S3Client({ region: env.AWS_REGION });
  const command = new GetObjectCommand({
    Bucket: JPC_EATS_RESOURCES_BUCKET_NAME,
    Key: key,
  });
  const response = await client.send(command);
  if (!response.Body) {
    throw new Error(`Object with key ${key} not found`);
  }
  console.log("body", response.Body);
  const byteArray = await response.Body.transformToByteArray();
  console.log({ byteArray });
  const base64String = btoa(String.fromCharCode(...new Uint8Array(byteArray)));

  // const base64String = btoa(bodyString);
  console.log({ base64String });
  return `data:image/png;base64,${base64String}`;
  // return getSignedUrl(client, command, { expiresIn: 3600 });
};

const uploadFile = async (key: string, payload: Buffer) => {
  const client = new S3Client({ region: env.AWS_REGION });

  const command = new PutObjectCommand({
    Key: key,
    Bucket: JPC_EATS_RESOURCES_BUCKET_NAME,
    Body: payload,
  });
  const response = await client.send(command);
  console.log({ response });
};

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });

  const photoId = event.queryStringParameters?.photoId;
  const widthPx = event.queryStringParameters?.widthPx;
  const heightPx = event.queryStringParameters?.heightPx;
  const url = `${GOOGLE_PLACES_API_URL}/${photoId}/media?maxHeightPx=${heightPx}&maxWidthPx=${widthPx}&key=${GOOGLE_PLACES_API_KEY}`;

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
    console.log(`Looking up public/${md5}.jpg...`);
    const linkToStorageFile = await getPresignedUrl(`public/${md5}.jpg`);
    const response: LambdaFunctionURLResult = {
      statusCode: 200,
      body: JSON.stringify({
        name: md5,
        photoUri: linkToStorageFile,
        fromCache: true,
      }),
    };

    console.log("CACHE HIT!", { response });
    return response;
  } catch (e) {
    console.log("Cache miss!", e);
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

    try {
      const bytes = await fetch(placesApiResponseImage.photoUri);
      console.log(`Uploading public/${md5}.jpg...`);
      const result = await uploadFile(
        `public/${md5}.jpg`,
        Buffer.from(await bytes.arrayBuffer()),
      );
      console.log("Succeeded: ", result);
    } catch (error) {
      console.log("Error : ", error);
    }

    return response;
  }
};
