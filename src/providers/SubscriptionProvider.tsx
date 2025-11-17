import { ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/amplify-client";
import { useAuth } from "../hooks/useAuth";

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const rotationCreateSub = client.models.Rotation.onCreate().subscribe({
      next: () => queryClient.invalidateQueries({ queryKey: ["rotation"] }),
    });

    const rotationDeleteSub = client.models.Rotation.onDelete().subscribe({
      next: () => queryClient.invalidateQueries({ queryKey: ["rotation"] }),
    });

    const choiceCreateSub = client.models.Choice.onCreate().subscribe({
      next: () => queryClient.invalidateQueries({ queryKey: ["choices"] }),
    });

    const choiceUpdateSub = client.models.Choice.onUpdate().subscribe({
      next: () => queryClient.invalidateQueries({ queryKey: ["choices"] }),
    });

    const prefsCreateSub = client.models.Preferences.onCreate().subscribe({
      next: () => queryClient.invalidateQueries({ queryKey: ["preferences"] }),
    });

    const prefsUpdateSub = client.models.Preferences.onUpdate().subscribe({
      next: () => queryClient.invalidateQueries({ queryKey: ["preferences"] }),
    });

    return () => {
      rotationCreateSub.unsubscribe();
      rotationDeleteSub.unsubscribe();
      choiceCreateSub.unsubscribe();
      choiceUpdateSub.unsubscribe();
      prefsCreateSub.unsubscribe();
      prefsUpdateSub.unsubscribe();
    };
  }, [user, queryClient]);

  return <>{children}</>;
}
