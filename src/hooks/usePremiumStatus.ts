"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface PremiumStatus {
  isPremium: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export function usePremiumStatus(): PremiumStatus {
  const { status } = useSession();
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPremiumStatus = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/premium");
      if (response.ok) {
        const data = (await response.json()) as { isPremium: boolean; isAdmin: boolean };
        setIsPremium(data.isPremium);
        setIsAdmin(data.isAdmin);
      }
    } catch (error) {
      console.error("Failed to fetch premium status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  return { isPremium, isAdmin, isLoading };
}
