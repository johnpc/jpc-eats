import { AuthUser } from "aws-amplify/auth";
import {
  ChoiceEntity,
  Place,
  PlaceV1,
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
import config from "../../amplify_outputs.json";
import { useDebounce } from "use-debounce";

export const PlaceSearchPage = (props: {
  user: AuthUser;
  youAreHere: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  preferences: PreferencesEntity;
  loading: boolean;
}) => {
  const { tokens } = useTheme();
  const [search, setSearch] = useState<string>("food");
  const [searchValue] = useDebounce(search, 500);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(props.loading);
  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      setPlaces([]);
      const responseSearch = await fetch(config.custom.searchPlacesFunction, {
        body: JSON.stringify({
          latitude: props.youAreHere.latitude,
          longitude: props.youAreHere.longitude,
          search: searchValue,
        }),
        method: "POST",
      });

      const jsonSearch = await responseSearch.json();
      console.log({ jsonSearch });
      setPlaces(jsonSearch.places);
      setLoading(false);
    };
    setup();
  }, [searchValue]);

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    console.log({ value: e.target.value });
    if (e.target.value !== search) {
      setSearch(e.target.value);
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
              onClick={() => setSearch(item.title)}
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
              <Loader variation="linear" />
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
