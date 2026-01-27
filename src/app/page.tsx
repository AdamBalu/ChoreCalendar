"use client";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { ChoreProvider, useChores } from "@/context/ChoreContext";
import { ChoreCreator } from "@/components/ChoreCreator";
import { ChorePool } from "@/components/ChorePool";
import { Calendar } from "@/components/Calendar";
import { AuthButton } from "@/components/AuthButton";
import type { Chore } from "@/types";

function ChoreCalendarApp() {
  const { placeChoreOnCalendar, chores } = useChores();
  const [activeChore, setActiveChore] = useState<Chore | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const chore = chores.find((c) => c.id === event.active.id);
    if (chore) {
      setActiveChore(chore);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveChore(null);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const choreId = active.id as string;
      const date = over.id as string;

      // Only place if dropping on a valid date cell
      if (/^\d{4}-\d{2}-\d{2}$/.exec(date)) {
        void placeChoreOnCalendar(choreId, date);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveChore(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="app-container">
        <header className="app-header">
          <div className="flex-1">
            <h1>Chore Calendar</h1>
            <p>
              Create chores, drag them to days, and track your daily progress
            </p>
          </div>
          <AuthButton />
        </header>

        <ChoreCreator />
        <ChorePool />
        <Calendar />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeChore && (
          <div className="drag-overlay">
            {activeChore.iconType === "emoji" ? (
              <span className="text-2xl">{activeChore.icon}</span>
            ) : (
              <img
                src={activeChore.icon}
                alt={activeChore.name}
                className="h-8 w-8 object-contain"
              />
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default function HomePage() {
  return (
    <ChoreProvider>
      <ChoreCalendarApp />
    </ChoreProvider>
  );
}
