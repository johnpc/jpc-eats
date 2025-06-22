import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { View, Heading, Text, Card, Loader } from '@aws-amplify/ui-react';
import { ChoiceEntity } from '../entities';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface StatsPageProps {
  choices: ChoiceEntity[];
}

interface PlaceStats {
  name: string;
  count: number;
  placeId: string;
  displayName?: string;
}

// Generate colors for the pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0',
  '#87D068', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'
];

const StatsPage: React.FC<StatsPageProps> = ({ choices }) => {
  const [placeStats, setPlaceStats] = useState<PlaceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSelections, setTotalSelections] = useState(0);

  useEffect(() => {
    const calculateStats = async () => {
      setLoading(true);

      // Filter choices that have a selected place (not "NONE" or null/undefined)
      const completedChoices = choices.filter(
        choice => choice.selectedPlaceId &&
                 choice.selectedPlaceId !== "NONE" &&
                 choice.selectedPlaceId !== null
      );

      console.log('Completed choices:', completedChoices);

      // Count occurrences of each selected place
      const placeCountMap = new Map<string, number>();

      completedChoices.forEach(choice => {
        const placeId = choice.selectedPlaceId!;
        placeCountMap.set(placeId, (placeCountMap.get(placeId) || 0) + 1);
      });

      console.log('Place count map:', placeCountMap);

      // Fetch place details for each unique place ID
      const statsData: PlaceStats[] = [];

      for (const [placeId, count] of placeCountMap.entries()) {
        try {
          // Try to get place details from Google Places API
          const placeResponse = await client.queries.getGooglePlace({
            placeId: placeId
          });

          const placeName = placeResponse.data?.displayName?.text ||
                           placeResponse.data?.name ||
                           `Place ${placeId.substring(0, 8)}...`;

          statsData.push({
            name: placeName,
            count,
            placeId,
            displayName: placeName
          });
        } catch (error) {
          console.warn(`Failed to fetch place details for ${placeId}:`, error);
          // Fallback to using place ID if API call fails
          statsData.push({
            name: `Place ${placeId.substring(0, 8)}...`,
            count,
            placeId
          });
        }
      }

      // Sort by count descending
      statsData.sort((a, b) => b.count - a.count);

      setPlaceStats(statsData);
      setTotalSelections(completedChoices.length);
      setLoading(false);
    };

    calculateStats();
  }, [choices]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card padding="small" backgroundColor="white" boxShadow="medium">
          <Text fontWeight="bold">{data.name}</Text>
          <Text>Selections: {data.count}</Text>
          <Text>Percentage: {((data.count / totalSelections) * 100).toFixed(1)}%</Text>
        </Card>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View padding="large" textAlign="center">
        <Loader size="large" />
        <Text>Loading statistics...</Text>
      </View>
    );
  }

  if (placeStats.length === 0) {
    return (
      <View padding="large" textAlign="center">
        <Heading level={3}>No Selection Data</Heading>
        <Text>
          No completed selections found. Start making choices to see your dining statistics!
        </Text>
      </View>
    );
  }

  return (
    <View padding="medium">
      <Heading level={2} textAlign="center" marginBottom="medium">
        Dining Statistics
      </Heading>

      <Card padding="medium" marginBottom="medium">
        <Text textAlign="center" fontSize="large">
          <strong>Total Selections: {totalSelections}</strong>
        </Text>
        <Text textAlign="center" color="gray">
          Based on {choices.length} total choices ({choices.length - totalSelections} pending)
        </Text>
      </Card>

      <Card padding="medium">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={placeStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {placeStats.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, legendEntry: any) => (
                <span style={{ color: legendEntry.color }}>
                  {value} ({legendEntry.payload.count})
                </span>
              )}
            /> */}
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {placeStats.length > 0 && (
        <Card padding="medium" marginTop="medium">
          <Heading level={4} marginBottom="small">Top Selections</Heading>
          {placeStats.slice(0, 5).map((place, index) => (
            <div key={place.placeId}
                 style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   padding: '8px',
                   backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'transparent'
                 }}
            >
              <Text>{place.name}</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text fontWeight="bold">{place.count}</Text>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: COLORS[index % COLORS.length],
                    borderRadius: '2px'
                  }}
                />
              </div>
            </div>
          ))}
        </Card>
      )}
    </View>
  );
};

export default StatsPage;
