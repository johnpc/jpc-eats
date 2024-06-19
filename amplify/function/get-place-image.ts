import { LambdaFunctionURLEvent, LambdaFunctionURLResult } from "aws-lambda";
import crypto from "crypto";
import { env } from "$amplify/env/get-place-image";
// const env = {} as any;
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
  console.log({ JPC_EATS_RESOURCES_BUCKET_NAME, key });
  const response = await client.send(command);
  if (!response.Body) {
    throw new Error(`Object with key ${key} not found`);
  }
  console.log("body", response.Body);
  const byteArray = await response.Body.transformToByteArray();
  console.log({ byteArray });
  const uInt8Array = new Uint8Array(byteArray);
  console.log({ uInt8Array });
  const stringFromCharCode = String.fromCharCode(...uInt8Array);
  console.log({ stringFromCharCode });
  const base64String = btoa(stringFromCharCode);

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

export const getImageBase64 = async (
  photoId: string,
  widthPx: number = 400,
  heightPx: number = 400,
  shouldSleep: boolean = false,
) => {
  const url = `${GOOGLE_PLACES_API_URL}/${photoId}/media?maxHeightPx=${heightPx}&maxWidthPx=${widthPx}&key=${GOOGLE_PLACES_API_KEY}`;
  console.log({ url });
  const md5 = crypto.createHash("md5").update(url).digest("hex");
  try {
    console.log(`Looking up public/${md5}.jpg...`);
    return await getPresignedUrl(`public/${md5}.jpg`);
  } catch (e) {
    console.log("Cache miss!", e);
    const placesApiResponse = await fetch(url, {
      method: "GET",
      redirect: "manual",
    });
    console.log({ placesApiResponse });
    const placesApiResponseImage = await placesApiResponse.json();
    console.log({ placesApiResponseImage });
    const bytes = await fetch(placesApiResponseImage.photoUri);
    console.log(`Uploading public/${md5}.jpg...`);
    const result = await uploadFile(
      `public/${md5}.jpg`,
      Buffer.from(await bytes.arrayBuffer()),
    );
    console.log({ result });

    const sleep = (milliseconds: number) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    if (shouldSleep) {
      await sleep(500);
    }

    return await getPresignedUrl(`public/${md5}.jpg`);
  }
};

export const handler = async (event: LambdaFunctionURLEvent) => {
  console.log({ event });
  const photoId = event.queryStringParameters?.photoId;
  const widthPx = event.queryStringParameters?.widthPx;
  const heightPx = event.queryStringParameters?.heightPx;

  const photoUri = await getImageBase64(
    photoId!,
    widthPx ? parseInt(widthPx) : undefined,
    heightPx ? parseInt(heightPx) : undefined,
    true,
  );
  const response: LambdaFunctionURLResult = {
    statusCode: 200,
    body: JSON.stringify({
      name: photoId,
      photoUri: photoUri,
      fromCache: true,
    }),
  };

  return response;
};
