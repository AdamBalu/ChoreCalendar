"use client";

import { useDroppable } from "@dnd-kit/core";
import { ProgressBar } from "./ProgressBar";
import { useChores } from "@/context/ChoreContext";
import type { ChoreInstance } from "@/types";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function DayCell({ date, isCurrentMonth, isToday }: DayCellProps) {
  const {
    calendarData,
    targetScore,
    getDayScore,
    isDayComplete,
    removeFromCalendar,
  } = useChores();

  const dateKey = date.toISOString().split("T")[0] ?? "";
  const dayChores: ChoreInstance[] = calendarData[dateKey] ?? [];
  const dayScore = getDayScore(dateKey);
  const isComplete = isDayComplete(dateKey);

  const { setNodeRef, isOver } = useDroppable({
    id: dateKey,
    data: { date: dateKey },
  });

  const handleRemoveChore = (instanceId: string) => {
    removeFromCalendar(dateKey, instanceId);
  };

  return (
    <div
      ref={setNodeRef}
      className={`day-cell ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""} ${isOver ? "drag-over" : ""} ${isComplete ? "complete" : ""} `}
    >
      <div className="day-cell-header">
        <span className="day-cell-number">{date.getDate()}</span>
        {dayScore > 0 && (
          <span className={`day-cell-score ${isComplete ? "complete" : ""}`}>
            {dayScore}
          </span>
        )}
      </div>

      <div className="day-cell-chores">
        {dayChores.map((instance: ChoreInstance) => (
          <div
            key={instance.id}
            className="day-cell-chore group"
            onClick={() => handleRemoveChore(instance.id)}
            title={`${instance.chore.name} (+${instance.chore.score}) - click to remove`}
          >
            {instance.chore.iconType === "emoji" ? (
              <span className="text-sm">{instance.chore.icon}</span>
            ) : (
              <img
                src={instance.chore.icon}
                alt={instance.chore.name}
                className="h-4 w-4 object-contain"
              />
            )}
            <div className="day-cell-chore-remove">×</div>
          </div>
        ))}
      </div>

      {dayChores.length > 0 && (
        <div className="day-cell-progress">
          <ProgressBar
            current={dayScore}
            target={targetScore}
            showValue={false}
          />
        </div>
      )}
    </div>
  );
}
