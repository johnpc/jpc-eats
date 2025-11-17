import { useQuery } from "@tanstack/react-query";
import { useAmplifyClient } from "./useAmplifyClient";

export function usePlace(placeId: string) {
  const client = useAmplifyClient();

  return useQuery({
    queryKey: ["place", placeId],
    queryFn: async () => {
      const response = await client.queries.getGooglePlace({ placeId });
      return response.data;
    },
    enabled: !!placeId,
  });
}
