import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, Text, Loader, Heading, useTheme } from "@aws-amplify/ui-react";
import { ChoiceEntity } from "../../lib/types";
import { client } from "../../lib/amplify-client";

interface PlaceStats {
  name: string;
  count: number;
  placeId: string;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC658", "#FF7C7C", "#8DD1E1", "#D084D0",
];

interface StatsChartProps {
  choices: ChoiceEntity[];
}

export function StatsChart({ choices }: StatsChartProps) {
  const { tokens } = useTheme();
  const [stats, setStats] = useState<PlaceStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const placeCountMap = new Map<string, number>();
      
      choices.forEach((choice) => {
        const placeId = choice.selectedPlaceId!;
        placeCountMap.set(placeId, (placeCountMap.get(placeId) || 0) + 1);
      });

      const statsData: PlaceStats[] = [];
      for (const [placeId, count] of placeCountMap.entries()) {
        try {
          const response = await client.queries.getGooglePlace({ placeId });
          const name = response.data?.displayName?.text || response.data?.name || placeId;
          statsData.push({ name, count, placeId });
        } catch {
          statsData.push({ name: placeId.substring(0, 8) + "...", count, placeId });
        }
      }

      statsData.sort((a, b) => b.count - a.count);
      setStats(statsData);
      setLoading(false);
    };

    loadStats();
  }, [choices]);

  if (loading) return <Loader />;

  return (
    <>
      <Card marginBottom={tokens.space.medium}>
        <Text textAlign="center" fontSize="large">
          <strong>Total Selections: {choices.length}</strong>
        </Text>
      </Card>

      <Card>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
              label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : null}
            >
              {stats.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card marginTop={tokens.space.medium}>
        <Heading level={5} marginBottom={tokens.space.small}>Top Selections</Heading>
        {stats.slice(0, 5).map((place, index) => (
          <div
            key={place.placeId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px",
              backgroundColor: index % 2 === 0 ? "#f5f5f5" : "transparent",
            }}
          >
            <Text>{place.name}</Text>
            <Text fontWeight="bold">{place.count}</Text>
          </div>
        ))}
      </Card>
    </>
  );
}
