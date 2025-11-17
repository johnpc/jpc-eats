import { useEffect, useState } from "react";
import { Card, Text, Loader, Collection, useTheme } from "@aws-amplify/ui-react";
import { ChoiceEntity } from "../../lib/types";
import { client } from "../../lib/amplify-client";

interface HistoryItem {
  selectedName: string;
  optionNames: string[];
  date: string;
}

interface HistoryListProps {
  choices: ChoiceEntity[];
}

export function HistoryList({ choices }: HistoryListProps) {
  const { tokens } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const historyData = await Promise.all(
        choices
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .map(async (choice) => {
            try {
              const selectedResponse = await client.queries.getGooglePlace({
                placeId: choice.selectedPlaceId!,
              });
              const selectedName =
                selectedResponse.data?.displayName?.text ||
                selectedResponse.data?.name ||
                "Unknown";

              const optionResponses = await Promise.all(
                choice.optionPlaceIds
                  .filter((id): id is string => !!id)
                  .map((id) => client.queries.getGooglePlace({ placeId: id }))
              );

              const optionNames = optionResponses.map(
                (r) => r.data?.displayName?.text || r.data?.name || "Unknown"
              );

              return {
                selectedName,
                optionNames,
                date: new Date(choice.updatedAt).toLocaleDateString(),
              };
            } catch {
              return {
                selectedName: "Unknown",
                optionNames: [],
                date: new Date(choice.updatedAt).toLocaleDateString(),
              };
            }
          })
      );

      setHistory(historyData);
      setLoading(false);
    };

    loadHistory();
  }, [choices]);

  if (loading) return <Loader />;

  return (
    <Collection
      items={history}
      type="list"
      direction="column"
      gap="medium"
      marginBottom={tokens.space.medium}
    >
      {(item, index) => (
        <Card key={index}>
          <Text>
            Selected <strong>{item.selectedName}</strong> on {item.date}
          </Text>
          {item.optionNames.length > 0 && (
            <ul style={{ marginTop: "8px" }}>
              {item.optionNames.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </Collection>
  );
}
