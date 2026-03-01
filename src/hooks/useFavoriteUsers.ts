import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/amplify-client";
import { FavoriteUserEntity } from "../lib/types";

export function useFavoriteUsers() {
  return useQuery({
    queryKey: ["favoriteUsers"],
    queryFn: async () => {
      const { data } = await client.models.FavoriteUser.list();
      return data as FavoriteUserEntity[];
    },
  });
}

export function useAddFavoriteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await client.models.FavoriteUser.create({ email });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteUsers"] });
    },
  });
}

export function useRemoveFavoriteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await client.models.FavoriteUser.delete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteUsers"] });
    },
  });
}
