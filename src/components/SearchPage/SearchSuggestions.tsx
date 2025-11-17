import { Card, Collection, ScrollView, useTheme } from "@aws-amplify/ui-react";

const SUGGESTIONS = [
  "Fast Food", "Sushi", "Pizza", "Mexican Food", "Indian Food", "Asian Food",
  "American Food", "Mediterranean Food", "Burgers", "Sandwiches", "Healthy Food",
  "Bubble Tea", "Dessert", "Ice Cream", "Salad", "Vegan Food", "Snacks",
  "Diners", "Coffee Shops", "Bars", "Brewery", "Breakfast", "Wings", "Deli",
  "Food Truck", "Buffet", "Wine Bar", "Tacos", "Brunch",
];

interface SearchSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  const { tokens } = useTheme();

  return (
    <ScrollView width="100%">
      <Collection
        items={SUGGESTIONS.map((title) => ({ title }))}
        type="list"
        direction="row"
        gap={tokens.space.xs}
        margin={tokens.space.xs}
        wrap="nowrap"
      >
        {(item, index) => (
          <Card
            key={index}
            paddingTop={tokens.space.medium}
            onClick={() => onSelect(item.title)}
            borderRadius="small"
            variation="elevated"
          >
            {item.title}
          </Card>
        )}
      </Collection>
    </ScrollView>
  );
}
