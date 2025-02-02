import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PreferencesEntity,
  RotationEntity,
} from "../entities";
import {
  Card,
  Collection,
  Heading,
  Loader,
  Message,
  ScrollView,
  SearchField,
  useTheme,
} from "@aws-amplify/ui-react";
import { PlaceCard } from "./PlaceListPage/PlaceCard";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
const client = generateClient<Schema>();

export const PlaceSearchPage = (props: {
  user: AuthUser;
  youAreHere: { latitude: number; longitude: number };
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
}) => {
  const { tokens } = useTheme();
  const [search, setSearch] = useState<string>("food");
  const [searchValue] = useDebounce(search, 500);
  const defaultPlaces = localStorage.getItem("places") ? JSON.parse(localStorage.getItem("places")!) : []
  const [places, setPlaces] = useState<Place[]>(defaultPlaces);
  const [loading, setLoading] = useState<boolean>((defaultPlaces ?? []).length === 0);
  useEffect(() => {
    const setup = async () => {
      const responseSearch = await client.queries.searchGooglePlaces({
        latitude: props.youAreHere.latitude,
        longitude: props.youAreHere.longitude,
        search: searchValue,
      });

      console.log({ jsonSearch: responseSearch.data });
      localStorage.setItem("places", JSON.stringify(responseSearch.data))
      setPlaces(responseSearch.data as unknown as Place[]);
      setLoading(false);
    };
    setup();
  }, [props.youAreHere, searchValue]);

  const handleSetSearch = (value: string) => {
    setLoading(true);
    setSearch(value);
  }
  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    console.log({ value: e.target.value });
    if (e.target.value !== search) {
      handleSetSearch(e.target.value);
    }
  };
  const debouncedOnChange = handleSearchChange;

  const searchSuggestions = [
    {
      title: "Fast Food",
    },
    {
      title: "Sushi",
    },
    {
      title: "Pizza",
    },
    {
      title: "Mexican Food",
    },
    {
      title: "Indian Food",
    },
    {
      title: "Asian Food",
    },
    {
      title: "American Food",
    },
    {
      title: "Mediterranean Food",
    },
    {
      title: "Burgers",
    },
    {
      title: "Sandwiches",
    },
    {
      title: "Healthy Food",
    },
    {
      title: "Bubble Tea",
    },
    {
      title: "Dessert",
    },
    {
      title: "Ice Cream",
    },
    {
      title: "Salad",
    },
    {
      title: "Vegan Food",
    },
    {
      title: "Snacks",
    },
    {
      title: "Diners",
    },
    {
      title: "Coffee Shops",
    },
    {
      title: "Bars",
    },
    {
      title: "Brewery",
    },
    {
      title: "Breakfast",
    },
    {
      title: "Wings",
    },
    {
      title: "Deli",
    },
    {
      title: "Food Truck",
    },
    {
      title: "Buffet",
    },
    {
      title: "Wine Bar",
    },
    {
      title: "Tacos",
    },
    {
      title: "Brunch",
    },
  ];
  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Search Restaurants</Heading>
      <ScrollView width="100%">
        <Collection
          items={searchSuggestions}
          type="list"
          direction="row"
          gap={tokens.space.xs}
          textAlign="center"
          margin={tokens.space.xs}
          wrap="nowrap"
        >
          {(item, index) => (
            <Card
              paddingTop={tokens.space.medium}
              onClick={() => handleSetSearch(item.title)}
              key={index}
              borderRadius="small"
              variation="elevated"
            >
              {item.title}
            </Card>
          )}
        </Collection>
      </ScrollView>
      <SearchField
        marginTop={tokens.space.small}
        marginBottom={tokens.space.small}
        label="Search"
        placeholder="Search here..."
        value={search}
        defaultValue={search}
        hasSearchIcon={true}
        hasSearchButton={false}
        onChange={debouncedOnChange}
      />
      {loading ? <Loader variation="linear" /> : null}
      <Collection
        items={places}
        type="list"
        direction="column"
        gap="medium"
        marginBottom={tokens.space.medium}
        searchNoResultsFound={
          <Message
            variation="outlined"
            colorTheme={loading ? "info" : "warning"}
            marginBottom={tokens.space.medium}
            heading={loading ? "Loading..." : "No places found"}
          >
            {loading ? (
              null
            ) : (
              "No restaurants near you were found. Reach out to support for more information."
            )}
          </Message>
        }
      >
        {(item) => (
          <PlaceCard
            key={item.id}
            place={item}
            rotation={props.rotation}
            choices={props.choices}
            preferences={props.preferences}
          />
        )}
      </Collection>
    </>
  );
};
