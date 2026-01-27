"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import type { Chore, ChoreInstance, CalendarData } from "@/types";
import * as api from "@/lib/api";

// ============ Types ============

interface ChoreStore {
  chores: Chore[];
  calendarData: CalendarData;
  targetScore: number;
  isLoading: boolean;
  isAuthenticated: boolean;
  setTargetScore: (score: number) => void;
  createChore: (
    name: string,
    icon: string,
    iconType: "emoji" | "image",
    score: number,
  ) => Promise<Chore | null>;
  deleteChore: (choreId: string) => Promise<void>;
  toggleFavorite: (choreId: string) => Promise<void>;
  placeChoreOnCalendar: (choreId: string, date: string) => Promise<void>;
  removeFromCalendar: (date: string, instanceId: string) => Promise<void>;
  getDayScore: (date: string) => number;
  isDayComplete: (date: string) => boolean;
}

const ChoreContext = createContext<ChoreStore | null>(null);

// ============ Helpers ============

const generateId = () => Math.random().toString(36).substring(2, 11);

// ============ Provider ============

export function ChoreProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session?.user;
  const isLoading = status === "loading";

  // State
  const [chores, setChores] = useState<Chore[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [targetScore, setTargetScoreState] = useState(10);
  const [hasFetched, setHasFetched] = useState(false);

  // Debounce ref for targetScore
  const targetScoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // -------- Data Fetching --------

  useEffect(() => {
    if (!isAuthenticated || hasFetched || isLoading) return;

    const fetchAllData = async () => {
      try {
        const [choresData, calData, settings] = await Promise.all([
          api.fetchChores(),
          api.fetchCalendar(),
          api.fetchUserSettings(),
        ]);
        setChores(choresData);
        setCalendarData(calData);
        setTargetScoreState(settings.targetScore);
        setHasFetched(true);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    void fetchAllData();
  }, [isAuthenticated, hasFetched, isLoading]);

  // Reset on logout
  useEffect(() => {
    if (!isAuthenticated && hasFetched) {
      setChores([]);
      setCalendarData({});
      setTargetScoreState(10);
      setHasFetched(false);
    }
  }, [isAuthenticated, hasFetched]);

  // -------- Target Score (debounced) --------

  const setTargetScore = useCallback(
    (score: number) => {
      setTargetScoreState(score);

      // Don't sync if not authenticated
      if (!isAuthenticated) return;

      // Clear existing timeout
      if (targetScoreTimeoutRef.current) {
        clearTimeout(targetScoreTimeoutRef.current);
      }

      // Debounce: save after 800ms of no changes
      targetScoreTimeoutRef.current = setTimeout(() => {
        api.updateTargetScoreAPI(score).catch((err) => {
          console.error("Failed to save target score:", err);
        });
      }, 800);
    },
    [isAuthenticated],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (targetScoreTimeoutRef.current) {
        clearTimeout(targetScoreTimeoutRef.current);
      }
    };
  }, []);

  // -------- Chore Operations --------

  const createChore = useCallback(
    async (
      name: string,
      icon: string,
      iconType: "emoji" | "image",
      score: number,
    ): Promise<Chore | null> => {
      // Local-only mode
      if (!isAuthenticated) {
        const newChore: Chore = {
          id: generateId(),
          name,
          icon,
          iconType,
          score,
          isFavorite: false,
        };
        setChores((prev) => [...prev, newChore]);
        return newChore;
      }

      try {
        const newChore = await api.createChoreAPI({
          name,
          icon,
          iconType,
          score,
        });
        setChores((prev) => [...prev, newChore]);
        return newChore;
      } catch (error) {
        console.error("Failed to create chore:", error);
        return null;
      }
    },
    [isAuthenticated],
  );

  const deleteChore = useCallback(
    async (choreId: string) => {
      if (!isAuthenticated) {
        setChores((prev) => prev.filter((c) => c.id !== choreId));
        return;
      }

      try {
        await api.deleteChoreAPI(choreId);
        setChores((prev) => prev.filter((c) => c.id !== choreId));
      } catch (error) {
        console.error("Failed to delete chore:", error);
      }
    },
    [isAuthenticated],
  );

  const toggleFavorite = useCallback(
    async (choreId: string) => {
      const chore = chores.find((c) => c.id === choreId);
      if (!chore) return;

      const newFavorite = !chore.isFavorite;

      // Optimistic update
      setChores((prev) =>
        prev.map((c) =>
          c.id === choreId ? { ...c, isFavorite: newFavorite } : c,
        ),
      );

      if (!isAuthenticated) return;

      try {
        await api.toggleFavoriteAPI(choreId, newFavorite);
      } catch (error) {
        // Revert on error
        setChores((prev) =>
          prev.map((c) =>
            c.id === choreId ? { ...c, isFavorite: !newFavorite } : c,
          ),
        );
        console.error("Failed to toggle favorite:", error);
      }
    },
    [chores, isAuthenticated],
  );

  // -------- Calendar Operations --------

  const placeChoreOnCalendar = useCallback(
    async (choreId: string, date: string) => {
      const chore = chores.find((c) => c.id === choreId);
      if (!chore) return;

      // Local-only mode
      if (!isAuthenticated) {
        const instance: ChoreInstance = {
          id: generateId(),
          choreId: chore.id,
          chore: { ...chore },
        };
        setCalendarData((prev) => ({
          ...prev,
          [date]: [...(prev[date] ?? []), instance],
        }));
        if (!chore.isFavorite) {
          setChores((prev) => prev.filter((c) => c.id !== choreId));
        }
        return;
      }

      try {
        const instance = await api.addToCalendarAPI(chore, date);
        setCalendarData((prev) => ({
          ...prev,
          [date]: [...(prev[date] ?? []), instance],
        }));
        if (!chore.isFavorite) {
          await deleteChore(choreId);
        }
      } catch (error) {
        console.error("Failed to place chore:", error);
      }
    },
    [chores, isAuthenticated, deleteChore],
  );

  const removeFromCalendar = useCallback(
    async (date: string, instanceId: string) => {
      // Optimistic update
      setCalendarData((prev) => ({
        ...prev,
        [date]: (prev[date] ?? []).filter((i) => i.id !== instanceId),
      }));

      if (!isAuthenticated) return;

      try {
        await api.removeFromCalendarAPI(instanceId);
      } catch (error) {
        console.error("Failed to remove from calendar:", error);
      }
    },
    [isAuthenticated],
  );

  // -------- Computed Values --------

  const getDayScore = useCallback(
    (date: string): number => {
      const dayChores = calendarData[date] ?? [];
      return dayChores.reduce((sum, instance) => sum + instance.chore.score, 0);
    },
    [calendarData],
  );

  const isDayComplete = useCallback(
    (date: string): boolean => getDayScore(date) >= targetScore,
    [getDayScore, targetScore],
  );

  // -------- Context Value --------

  return (
    <ChoreContext.Provider
      value={{
        chores,
        calendarData,
        targetScore,
        isLoading,
        isAuthenticated,
        setTargetScore,
        createChore,
        deleteChore,
        toggleFavorite,
        placeChoreOnCalendar,
        removeFromCalendar,
        getDayScore,
        isDayComplete,
      }}
    >
      {children}
    </ChoreContext.Provider>
  );
}

// ============ Hook ============

export function useChores() {
  const context = useContext(ChoreContext);
  if (!context) {
    throw new Error("useChores must be used within a ChoreProvider");
  }
  return context;
}
