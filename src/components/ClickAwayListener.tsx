"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ClickAwayListenerProps {
  children: ReactNode;
  onClickAway: () => void;
}

export function ClickAwayListener({
  children,
  onClickAway,
}: ClickAwayListenerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onClickAway();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickAway]);

  return (
    <div ref={wrapperRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
