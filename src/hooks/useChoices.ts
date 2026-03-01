import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/amplify-client";
import { ChoiceEntity } from "../lib/types";
import { useAuth } from "./useAuth";

export function useChoices() {
  return useQuery({
    queryKey: ["choices"],
    queryFn: async () => {
      const { data } = await client.models.Choice.list();
      return data as ChoiceEntity[];
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
      // Find users who have favorited me
      const { data: favoritedBy } = await client.models.FavoriteUser.list({
        filter: { email: { eq: myEmail } },
      });
      if (!favoritedBy.length) return [];

      // Get their owner IDs and fetch their active choices
      const ownerEmails = favoritedBy.map((f) => f.owner).filter(Boolean);
      const results: ChoiceEntity[] = [];
      for (const email of ownerEmails) {
        const { data } = await client.models.Choice.listChoiceByOwnerEmail({ ownerEmail: email! });
        const active = data.find((c) => !c.selectedPlaceId || c.selectedPlaceId === "NONE");
        if (active) results.push(active as ChoiceEntity);
      }
      return results;
    },
  });
}

export function useCreateChoice() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (optionPlaceIds: string[]) => {
      const { data } = await client.models.Choice.create({
        optionPlaceIds,
        selectedPlaceId: "NONE",
        ownerEmail: user?.signInDetails?.loginId,
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
