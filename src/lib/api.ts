/**
 * API client for chore operations
 * Centralizes all fetch calls in one place
 */

import type { Chore, CalendarData, ChoreInstance } from "@/types";

// ============ Chores API ============

interface ChoreFromAPI {
  id: string;
  name: string;
  icon: string;
  iconType: "emoji" | "image";
  score: number;
  isFavorite: boolean;
}

export async function fetchChores(): Promise<Chore[]> {
  const res = await fetch("/api/chores");
  if (!res.ok) throw new Error("Failed to fetch chores");
  return res.json() as Promise<ChoreFromAPI[]>;
}

export async function createChoreAPI(chore: {
  name: string;
  icon: string;
  iconType: "emoji" | "image";
  score: number;
}): Promise<Chore> {
  const res = await fetch("/api/chores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chore),
  });
  if (!res.ok) throw new Error("Failed to create chore");
  return res.json() as Promise<Chore>;
}

export async function deleteChoreAPI(choreId: string): Promise<void> {
  const res = await fetch(`/api/chores?id=${choreId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete chore");
}

export async function toggleFavoriteAPI(
  choreId: string,
  isFavorite: boolean
): Promise<void> {
  const res = await fetch("/api/chores", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: choreId, isFavorite }),
  });
  if (!res.ok) throw new Error("Failed to toggle favorite");
}

// ============ Calendar API ============

interface CalendarInstanceFromAPI {
  id: string;
  choreId: string;
  date: string;
  choreName: string;
  choreIcon: string;
  choreIconType: "emoji" | "image";
  choreScore: number;
}

export async function fetchCalendar(): Promise<CalendarData> {
  const res = await fetch("/api/calendar");
  if (!res.ok) throw new Error("Failed to fetch calendar");
  
  const instances = (await res.json()) as CalendarInstanceFromAPI[];
  
  // Convert flat instances to CalendarData format
  const calendarData: CalendarData = {};
  for (const instance of instances) {
    calendarData[instance.date] ??= [];
    calendarData[instance.date]!.push({
      id: instance.id,
      choreId: instance.choreId,
      chore: {
        id: instance.choreId,
        name: instance.choreName,
        icon: instance.choreIcon,
        iconType: instance.choreIconType,
        score: instance.choreScore,
        isFavorite: false,
      },
    });
  }
  return calendarData;
}

export async function addToCalendarAPI(
  chore: Chore,
  date: string
): Promise<ChoreInstance> {
  const res = await fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      choreId: chore.id,
      date,
      choreName: chore.name,
      choreIcon: chore.icon,
      choreIconType: chore.iconType,
      choreScore: chore.score,
    }),
  });
  if (!res.ok) throw new Error("Failed to add to calendar");
  
  const data = (await res.json()) as { id: string };
  return {
    id: data.id,
    choreId: chore.id,
    chore: { ...chore },
  };
}

export async function removeFromCalendarAPI(instanceId: string): Promise<void> {
  const res = await fetch(`/api/calendar?id=${instanceId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from calendar");
}

// ============ User Settings API ============

interface UserSettings {
  targetScore: number;
}

export async function fetchUserSettings(): Promise<UserSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json() as Promise<UserSettings>;
}

export async function updateTargetScoreAPI(targetScore: number): Promise<void> {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetScore }),
  });
  if (!res.ok) throw new Error("Failed to update target score");
}
