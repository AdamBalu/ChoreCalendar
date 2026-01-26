"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useChoreStore, type ChoreStore } from "@/hooks/useChoreStore";

const ChoreContext = createContext<ChoreStore | null>(null);

export function ChoreProvider({ children }: { children: ReactNode }) {
  const store = useChoreStore(10);

  return (
    <ChoreContext.Provider value={store}>{children}</ChoreContext.Provider>
  );
}

export function useChores() {
  const context = useContext(ChoreContext);
  if (!context) {
    throw new Error("useChores must be used within a ChoreProvider");
  }
  return context;
}
