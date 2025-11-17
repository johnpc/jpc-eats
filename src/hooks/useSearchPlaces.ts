import { useQuery } from "@tanstack/react-query";
import { Coordinates } from "../lib/types";
import { useAmplifyClient } from "./useAmplifyClient";
import { useAuth } from "./useAuth";

export function useSearchPlaces(coordinates: Coordinates, searchTerm: string) {
  const client = useAmplifyClient();
  const { isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: [
      "places",
      coordinates.latitude,
      coordinates.longitude,
      searchTerm,
    ],
    queryFn: async () => {
      console.log("Searching for:", searchTerm, "at", coordinates);
      try {
        const response = await client.queries.searchGooglePlaces({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          search: searchTerm,
        });
        console.log("Search response:", response);
        console.log("Response data:", response.data);
        console.log("Response errors:", response.errors);
        return response.data || [];
      } catch (error) {
        console.error("Search error:", error);
        throw error;
      }
    },
    enabled: searchTerm.length > 0 && !authLoading,
    retry: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
}
