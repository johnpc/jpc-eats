import { useState, useEffect } from "react";
import { Heading, SearchField, Loader, Message, useTheme } from "@aws-amplify/ui-react";
import { useDebounce } from "use-debounce";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useSearchPlaces } from "../../hooks/useSearchPlaces";
import { SearchSuggestions } from "./SearchSuggestions";
import { PlacesList } from "../common/PlacesList";

export function SearchPage() {
  const { tokens } = useTheme();
  const [search, setSearch] = useState("food");
  const [debouncedSearch] = useDebounce(search, 500);
  const coordinates = useGeolocation();
  const { data: places = [], isLoading } = useSearchPlaces(coordinates, debouncedSearch);

  useEffect(() => {
    console.log("Search state:", { search, debouncedSearch, coordinates, isLoading, placesCount: places.length });
  }, [search, debouncedSearch, coordinates, isLoading, places.length]);

  return (
    <>
      <Heading marginBottom={tokens.space.xs}>Search Restaurants</Heading>
      <SearchSuggestions onSelect={setSearch} />
      <SearchField
        marginTop={tokens.space.small}
        marginBottom={tokens.space.small}
        label="Search"
        placeholder="Search here..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading && <Loader variation="linear" />}
      {!isLoading && places.length === 0 && (
        <Message variation="outlined" colorTheme="warning" heading="No places found">
          No restaurants near you were found.
        </Message>
      )}
      <PlacesList places={places} />
    </>
  );
}
