"use client";

import { useState, useRef, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* User button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-white transition-colors hover:bg-white/20"
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <span className="hidden text-sm sm:inline">{session.user.name}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full right-0 z-50 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-xl">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-white">
                {session.user.name}
              </p>
              <p className="text-xs text-white/60">{session.user.email}</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                void signOut();
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="flex h-9 items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </button>
  );
}
