"use client";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChoreProvider, useChores } from "@/context/ChoreContext";
import { ChoreCreator } from "@/components/ChoreCreator";
import { ChorePool } from "@/components/ChorePool";
import { Calendar } from "@/components/Calendar";
import { AuthButton } from "@/components/AuthButton";
import { LandingScreen } from "@/components/LandingScreen";
import type { Chore } from "@/types";

function ChoreCalendarApp() {
  const { placeChoreOnCalendar, chores } = useChores();
  const [activeChore, setActiveChore] = useState<Chore | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
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
            <div className="app-title-container">
              <div className="flex flex-row items-center gap-4">
                <img
                  src="chore-calendar-logo.png"
                  alt="Chore Calendar Logo"
                  className="h-7 w-7 sm:h-9 sm:w-9"
                />
                <h1>Chore Calendar</h1>
              </div>
              <p className="app-description">
                Create chores, drag them to days, and track your daily progress!
              </p>
            </div>
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
  const { status } = useSession();

  // Show landing screen for unauthenticated users
  if (status === "unauthenticated") {
    return <LandingScreen />;
  }

  // Show loading state briefly
  if (status === "loading") {
    return (
      <div className="landing-page">
        <div className="landing-content">
          <div className="landing-logo-placeholder" />
        </div>
      </div>
    );
  }

  return (
    <ChoreProvider>
      <ChoreCalendarApp />
    </ChoreProvider>
  );
}
