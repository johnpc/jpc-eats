import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/amplify-client";
import { ChoiceEntity } from "../lib/types";

export function useChoices() {
  return useQuery({
    queryKey: ["choices"],
    queryFn: async () => {
      const { data } = await client.models.Choice.list();
      return data as ChoiceEntity[];
    },
  });
}

export function useCreateChoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (optionPlaceIds: string[]) => {
      const { data } = await client.models.Choice.create({
        optionPlaceIds,
        selectedPlaceId: "NONE",
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choices"] });
    },
  });
}

export function useUpdateChoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (choice: Partial<ChoiceEntity> & { id: string }) => {
      const { data } = await client.models.Choice.update(choice);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["choices"] });
    },
  });
}
