import { useAuth } from "./useAuth";
import { client, publicClient } from "../lib/amplify-client";

export function useAmplifyClient() {
  const { user, isLoading } = useAuth();

  // While loading, use public client as default
  if (isLoading) {
    return publicClient;
  }

  return user ? client : publicClient;
}
