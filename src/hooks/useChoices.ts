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
      // Get all favorite users to share with
      const { data: favorites } = await client.models.FavoriteUser.list();
      const myFavorites = favorites.filter((f) => f.owner === user?.userId);

      if (myFavorites.length === 0) {
        // No favorites — create unshared choice
        const { data } = await client.models.Choice.create({
          optionPlaceIds,
          selectedPlaceId: "NONE",
          ownerEmail: user?.signInDetails?.loginId,
        });
        return data;
      }

      // Create one choice per favorite user
      const results = await Promise.all(
        myFavorites.map((fav) =>
          client.models.Choice.create({
            optionPlaceIds,
            selectedPlaceId: "NONE",
            ownerEmail: user?.signInDetails?.loginId,
            sharedWithEmail: fav.email,
          }),
        ),
      );
      return results[0].data;
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
