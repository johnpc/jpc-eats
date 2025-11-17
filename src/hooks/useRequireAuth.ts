import { useState } from "react";
import { useAuth } from "./useAuth";

export function useRequireAuth() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const requireAuth = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  return {
    requireAuth,
    showAuthModal,
    closeAuthModal: () => setShowAuthModal(false),
  };
}
