"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Upload,
  CalendarPlus,
  Lock,
  AlertCircle,
} from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import { useChores } from "@/context/ChoreContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { compressImage } from "@/lib/image";

export function ChoreCreator() {
  const router = useRouter();
  const { createChore } = useChores();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumStatus();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [iconType, setIconType] = useState<"emoji" | "image">("emoji");
  const [score, setScore] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Initial size check (5MB) before processing
    if (file.size > 2 * 1024 * 1024) {
      setError("Image is too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawDataUrl = event.target?.result as string;
        // Compress the image before setting it
        const compressedDataUrl = await compressImage(rawDataUrl);
        setIcon(compressedDataUrl);
        setIconType("image");
      } catch (err) {
        console.error("Image processing error:", err);
        setError("Failed to process image");
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    if (isPremium) {
      fileInputRef.current?.click();
    } else {
      router.push("/pricing");
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !icon) return;

    setIsCreating(true);
    await createChore(name.trim(), icon, iconType, score);

    // Reset form with animation delay
    setTimeout(() => {
      setName("");
      setIcon("");
      setIconType("emoji");
      setScore(1);
      setIsCreating(false);
    }, 300);
  };

  const handleEmojiSelect = (emoji: string) => {
    setIcon(emoji);
    setIconType("emoji");
  };

  return (
    <div className="chore-creator">
      <div className="chore-creator-inner">
        {/* Icon Selection */}
        <div className="chore-creator-icon-section">
          <EmojiPicker
            onSelect={handleEmojiSelect}
            selectedEmoji={iconType === "emoji" ? icon : undefined}
          />

          <div className="chore-creator-divider">or</div>

          <button
            type="button"
            className={`chore-creator-upload ${!isPremium && !isPremiumLoading ? "locked" : ""}`}
            onClick={handleUploadClick}
            title={
              isPremium
                ? "Upload custom image"
                : "Premium feature - click to upgrade"
            }
          >
            {iconType === "image" && icon ? (
              <img
                src={icon}
                alt="Uploaded"
                className="h-6 w-6 rounded object-contain"
              />
            ) : !isPremium && !isPremiumLoading ? (
              <Lock size={20} />
            ) : (
              <Upload size={20} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Name Input */}
        <div className="chore-creator-name">
          <input
            type="text"
            placeholder="Chore name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="chore-creator-input"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>

        {/* Score Control */}
        <div className="chore-creator-score">
          <button
            type="button"
            className="chore-creator-score-btn"
            onClick={() => setScore(Math.max(1, score - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="chore-creator-score-value">{score}</span>
          <button
            type="button"
            className="chore-creator-score-btn"
            onClick={() => setScore(score + 1)}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Create Button */}
        <button
          type="button"
          className={`chore-creator-submit ${isCreating ? "creating" : ""}`}
          onClick={handleCreate}
          disabled={!name.trim() || !icon || isCreating}
        >
          <CalendarPlus size={18} />
          <span>Create</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="chore-creator-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
