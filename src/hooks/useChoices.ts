import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/amplify-client";
import { ChoiceEntity } from "../lib/types";
import { useAuth } from "./useAuth";

export function useChoices() {
  const { user } = useAuth();
  const userId = user?.userId;

  return useQuery({
    queryKey: ["choices", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await client.models.Choice.list();
      // Only return choices you own
      return (data as ChoiceEntity[]).filter((c) => c.owner === userId);
    },
  });
}

export function useSharedChoices() {
  const { user } = useAuth();
  const myEmail = user?.signInDetails?.loginId;

  return useQuery({
    queryKey: ["sharedChoices", myEmail],
    enabled: !!myEmail,
    queryFn: async () => {
      // Query choices shared directly with my email
      const { data } = await client.models.Choice.listChoiceBySharedWithEmail({
        sharedWithEmail: myEmail!,
      });
      // Only return active (unselected) choices
      return (data as ChoiceEntity[]).filter(
        (c) => !c.selectedPlaceId || c.selectedPlaceId === "NONE",
      );
    },
  });
}

export function useCreateChoice() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (optionPlaceIds: string[]) => {
      // Get favorite user to share with
      const { data: favorites } = await client.models.FavoriteUser.list();
      const myFavorite = favorites.find((f) => f.owner === user?.userId);

      const { data } = await client.models.Choice.create({
        optionPlaceIds,
        selectedPlaceId: "NONE",
        ownerEmail: user?.signInDetails?.loginId,
        sharedWithEmail: myFavorite?.email,
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
      queryClient.invalidateQueries({ queryKey: ["sharedChoices"] });
    },
  });
}
