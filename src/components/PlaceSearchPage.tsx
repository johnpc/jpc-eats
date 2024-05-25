import { AuthUser } from "aws-amplify/auth";
import { ChoiceEntity, Place, PlaceV1, RotationEntity } from "../entities";
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

export const PlaceSearchPage = (props: {
  user: AuthUser;
  youAreHere?: { latitude: number; longitude: number };
  places: Place[];
  placesV1: PlaceV1[];
  rotation: RotationEntity[];
  choices: ChoiceEntity[];
  loading: boolean;
}) => {
  const { tokens } = useTheme();
  const [search, setSearch] = useState<string>("food");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(props.loading);
  useEffect(() => {
    const setup = async () => {
      if (!props.youAreHere) {
        return;
      }
      setLoading(true);
      setPlaces([]);
      const responseSearch = await fetch(config.custom.searchPlacesFunction, {
        body: JSON.stringify({
          latitude: props.youAreHere.latitude,
          longitude: props.youAreHere.longitude,
          search: search,
        }),
        method: "POST",
      });

      const jsonSearch = await responseSearch.json();
      console.log({ jsonSearch });
      setPlaces(jsonSearch.places);
      setLoading(false);
    };
    setup();
  }, [search, props.youAreHere]);
  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    if (e.target.value !== search) {
      setSearch(e.target.value);
    }
  };
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
  ];
  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Search Restaurants</Heading>

      <ScrollView width="90%" maxWidth="580px">
        <Collection
          items={searchSuggestions}
          type="list"
          direction="row"
          gap="5px"
          textAlign="center"
          justifyContent="center"
          margin={tokens.space.small}
          padding={tokens.space.small}
          wrap="nowrap"
        >
          {(item, index) => (
            <Card
              paddingTop={tokens.space.medium}
              onClick={() => setSearch(item.title)}
              key={index}
              borderRadius="small"
              maxWidth="10rem"
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
        onChange={handleSearchChange}
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
          />
        )}
      </Collection>
    </>
  );
};
