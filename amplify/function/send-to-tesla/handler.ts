import { DynamoDBStreamEvent } from "aws-lambda";

const TESSIE_API_KEY = process.env.TESSIE_API_KEY!;
const VIN = process.env.TESLA_VIN!;
const ALLOWED_OWNERS = (process.env.ALLOWED_OWNERS || "").split(",");

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  for (const record of event.Records) {
    if (record.eventName !== "MODIFY" && record.eventName !== "INSERT")
      continue;

    const newImage = record.dynamodb?.NewImage;
    const oldImage = record.dynamodb?.OldImage;
    if (!newImage) continue;

    const owner = newImage.owner?.S;
    const selectedPlaceId = newImage.selectedPlaceId?.S;
    const oldSelectedPlaceId = oldImage?.selectedPlaceId?.S;

    // Only trigger if selectedPlaceId changed and is valid
    if (
      !selectedPlaceId ||
      selectedPlaceId === "NONE" ||
      selectedPlaceId === oldSelectedPlaceId
    )
      continue;
    if (!owner || !ALLOWED_OWNERS.includes(owner)) continue;

    // Get address from GoogleApiCache
    const { DynamoDBClient, ScanCommand } =
      await import("@aws-sdk/client-dynamodb");
    const client = new DynamoDBClient({});
    const cacheResult = await client.send(
      new ScanCommand({
        TableName: process.env.CACHE_TABLE_NAME,
        FilterExpression: "contains(#h, :pid)",
        ExpressionAttributeNames: { "#h": "hash" },
        ExpressionAttributeValues: { ":pid": { S: selectedPlaceId } },
        Limit: 1,
      }),
    );

    const cacheItem = cacheResult.Items?.[0];
    if (!cacheItem?.value?.S) continue;

    const placeData = JSON.parse(cacheItem.value.S);
    const address = placeData.formattedAddress;
    if (!address) continue;

    // Send to Tesla
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
