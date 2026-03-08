import { DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const TESSIE_API_KEY = process.env.TESSIE_API_KEY!;
const VIN = process.env.TESLA_VIN!;
const ALLOWED_OWNERS = (process.env.ALLOWED_OWNERS || "").split(",");
const client = new DynamoDBClient({});

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  for (const record of event.Records) {
    if (record.eventName !== "MODIFY" && record.eventName !== "INSERT")
      continue;

    const newImage = record.dynamodb?.NewImage;
    const oldImage = record.dynamodb?.OldImage;
    if (!newImage) continue;

    const owner = newImage.owner?.S;
    const selectedPlaceId = newImage.selectedPlaceId?.S;
    const oldSelectedPlaceId = oldImage?.selectedPlaceId?.S;

    console.log("Processing:", { owner, selectedPlaceId, oldSelectedPlaceId });

    if (
      !selectedPlaceId ||
      selectedPlaceId === "NONE" ||
      selectedPlaceId === oldSelectedPlaceId
    ) {
      console.log("Skipping: invalid or unchanged selectedPlaceId");
      continue;
    }
    if (!owner || !ALLOWED_OWNERS.includes(owner)) {
      console.log("Skipping: owner not in allowed list", {
        owner,
        ALLOWED_OWNERS,
      });
      continue;
    }

    const cacheResult = await client.send(
      new QueryCommand({
        TableName: process.env.CACHE_TABLE_NAME,
        IndexName: "googleApiCachesByHash",
        KeyConditionExpression: "#h = :pid",
        ExpressionAttributeNames: { "#h": "hash" },
        ExpressionAttributeValues: { ":pid": { S: selectedPlaceId } },
        Limit: 1,
      }),
    );

    const cacheItem = cacheResult.Items?.[0];
    console.log("Cache result:", {
      found: !!cacheItem,
      hasValue: !!cacheItem?.value?.S,
    });
    if (!cacheItem?.value?.S) continue;

    const placeData = JSON.parse(cacheItem.value.S);
    const address = placeData.formattedAddress;
    console.log("Address:", address);
    if (!address) continue;

    const encoded = encodeURIComponent(address);
    const response = await fetch(
      `https://api.tessie.com/${VIN}/command/share?value=${encoded}&locale=en-US`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${TESSIE_API_KEY}` },
      },
    );
    const result = await response.json();
    console.log(`Sent "${address}" to Tesla:`, result);
  }
};
