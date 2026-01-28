"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Pin } from "lucide-react";
import type { Chore } from "@/types";

interface ChoreCardProps {
  chore: Chore;
  onToggleFavorite?: (id: string) => void;
  isDragging?: boolean;
  showLabel?: boolean;
  mini?: boolean;
  onRemove?: () => void;
}

export function ChoreCard({
  chore,
  onToggleFavorite,
  mini = false,
  onRemove,
}: ChoreCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: chore.id,
      data: { chore },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (mini) {
    return (
      <div
        className="chore-card-mini group relative"
        onClick={onRemove}
        title={`${chore.name} (+${chore.score})`}
      >
        {chore.iconType === "emoji" ? (
          <span className="text-base">{chore.icon}</span>
        ) : (
          <img
            src={chore.icon}
            alt={chore.name}
            className="h-5 w-5 object-contain"
          />
        )}
        <div className="chore-card-mini-remove">×</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`chore-card group ${isDragging ? "chore-card-dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      {/* Icon */}
      <div className="chore-card-icon">
        {chore.iconType === "emoji" ? (
          <span className="text-2xl">{chore.icon}</span>
        ) : (
          <img
            src={chore.icon}
            alt={chore.name}
            className="h-8 w-8 rounded object-contain"
          />
        )}
      </div>

      {/* Score badge */}
      <div className="chore-card-score">+{chore.score}</div>

      {/* Favorite star */}
      {onToggleFavorite && (
        <button
          className={`chore-card-star ${chore.isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(chore.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Pin size={14} fill={chore.isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      {/* Hover label */}
      <div className="chore-card-label">{chore.name}</div>
    </div>
  );
}
