"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPickerReact, { Theme, EmojiStyle } from "emoji-picker-react";
import { Smile, X } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

export function EmojiPicker({ onSelect, selectedEmoji }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`emoji-picker-container ${isOpen ? "open" : ""}`}
    >
      <button
        type="button"
        className="emoji-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedEmoji ? (
          <span className="text-2xl">{selectedEmoji}</span>
        ) : (
          <Smile size={24} className="text-white/50" />
        )}
      </button>

      {isOpen && (
        <div className="emoji-picker-dropdown">
          <button
            className="emoji-picker-close"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
          <EmojiPickerReact
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji);
              setIsOpen(false);
            }}
            lazyLoadEmojis
            searchPlaceholder="Search emoji..."
            width={isMobile ? 280 : 320}
            height={isMobile ? 350 : 400}
          />
        </div>
      )}
    </div>
  );
}
