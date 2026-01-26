// Core types for the Chore Calendar App

export interface Chore {
  id: string;
  name: string;
  icon: string; // emoji or data URL for uploaded image
  iconType: "emoji" | "image";
  score: number;
  isFavorite: boolean;
}

export interface ChoreInstance {
  id: string; // unique instance ID
  choreId: string;
  chore: Chore;
}

export interface CalendarDay {
  date: string; // ISO date string YYYY-MM-DD
  chores: ChoreInstance[];
}

export type CalendarData = Record<string, ChoreInstance[]>;
