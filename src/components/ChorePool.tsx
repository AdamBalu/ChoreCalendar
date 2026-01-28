"use client";

import { useChores } from "@/context/ChoreContext";
import { ChoreCard } from "./ChoreCard";
import { CalendarPlus } from "lucide-react";

export function ChorePool() {
  const { chores, toggleFavorite } = useChores();

  if (chores.length === 0) {
    return (
      <div className="chore-pool empty">
        <div className="chore-pool-empty">
          <CalendarPlus size={24} className="text-amber-500/50" />
          <p>Create your first chore above, then drag it to the calendar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chore-pool">
      <div className="chore-pool-header">
        <h3>Your Chores</h3>
        <span className="chore-pool-count">{chores.length}</span>
      </div>
      <div className="chore-pool-items">
        {chores.map((chore) => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
