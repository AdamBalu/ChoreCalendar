"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import { ClickAwayListener } from "./ClickAwayListener";
import Image from "next/image";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <ClickAwayListener onClickAway={() => setIsOpen(false)}>
        <div className="calendar-settings">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="calendar-settings-btn"
          >
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="hidden text-sm sm:inline">
              {session.user.name}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="calendar-settings-dropdown">
              <div className="mb-2 border-b border-white/10 px-2 pb-4">
                <p className="truncate text-sm font-medium text-white">
                  {session.user.name}
                </p>
                <p className="truncate text-xs text-white/60">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  void signOut();
                }}
                className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </ClickAwayListener>
    );
  }

  return (
    <button onClick={() => signIn()} className="calendar-settings-btn">
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </button>
  );
}
