import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/amplify-client";
import { RotationEntity } from "../lib/types";

export function useRotation() {
  return useQuery({
    queryKey: ["rotation"],
    queryFn: async () => {
      const { data } = await client.models.Rotation.list();
      return data as RotationEntity[];
    },
  });
}

export function useAddToRotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (googlePlaceId: string) => {
      const { data } = await client.models.Rotation.create({ googlePlaceId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotation"] });
    },
  });
}

export function useRemoveFromRotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await client.models.Rotation.delete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotation"] });
    },
  });
}
