'use client';

import { useState, useCallback } from 'react';
import type { Chore, ChoreInstance, CalendarData } from '@/types';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

export function useChoreStore(initialTargetScore = 10) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [targetScore, setTargetScore] = useState(initialTargetScore);

  const createChore = useCallback((
    name: string,
    icon: string,
    iconType: 'emoji' | 'image',
    score: number
  ) => {
    const newChore: Chore = {
      id: generateId(),
      name,
      icon,
      iconType,
      score,
      isFavorite: false,
    };
    setChores(prev => [...prev, newChore]);
    return newChore;
  }, []);

  const deleteChore = useCallback((choreId: string) => {
    setChores(prev => prev.filter(c => c.id !== choreId));
  }, []);

  const toggleFavorite = useCallback((choreId: string) => {
    setChores(prev => prev.map(c => 
      c.id === choreId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  }, []);

  const placeChoreOnCalendar = useCallback((choreId: string, date: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (!chore) return;

    const instance: ChoreInstance = {
      id: generateId(),
      choreId: chore.id,
      chore: { ...chore },
    };

    setCalendarData(prev => ({
      ...prev,
      [date]: [...(prev[date] ?? []), instance],
    }));

    // Remove non-favorite chores from pool after placing
    if (!chore.isFavorite) {
      setChores(prev => prev.filter(c => c.id !== choreId));
    }
  }, [chores]);

  const removeFromCalendar = useCallback((date: string, instanceId: string) => {
    setCalendarData(prev => ({
      ...prev,
      [date]: (prev[date] ?? []).filter(i => i.id !== instanceId),
    }));
  }, []);

  const getDayScore = useCallback((date: string): number => {
    const dayChores = calendarData[date] ?? [];
    return dayChores.reduce((sum, instance) => sum + instance.chore.score, 0);
  }, [calendarData]);

  const isDayComplete = useCallback((date: string): boolean => {
    return getDayScore(date) >= targetScore;
  }, [getDayScore, targetScore]);

  return {
    chores,
    calendarData,
    targetScore,
    setTargetScore,
    createChore,
    deleteChore,
    toggleFavorite,
    placeChoreOnCalendar,
    removeFromCalendar,
    getDayScore,
    isDayComplete,
  };
}

export type ChoreStore = ReturnType<typeof useChoreStore>;
