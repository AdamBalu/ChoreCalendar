"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { DayCell } from "./DayCell";
import { useChores } from "@/context/ChoreContext";
import { ClickAwayListener } from "./ClickAwayListener";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Calendar() {
  const { targetScore, setTargetScore } = useChores();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);

  // Get the Monday of the first week
  const startDate = new Date(firstDayOfMonth);
  const dayOfWeek = startDate.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + diff);

  // Generate 6 weeks of days
  const days: Date[] = [];
  const current = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button
            className="calendar-nav-btn"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="calendar-title">
            <h2>
              {MONTHS[month]} {year}
            </h2>
            <button className="calendar-today-btn" onClick={goToToday}>
              Today
            </button>
          </div>

          <button
            className="calendar-nav-btn"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <ClickAwayListener onClickAway={() => setShowSettings(false)}>
          <div className="calendar-settings">
            <button
              className="calendar-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={18} />
              <span>Daily Goal: {targetScore}</span>
            </button>

            {showSettings && (
              <div className="calendar-settings-dropdown">
                <label>Daily Score Target</label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                />
                <span className="calendar-settings-value">
                  {targetScore} points
                </span>
              </div>
            )}
          </div>
        </ClickAwayListener>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.getTime() === today.getTime();

          return (
            <DayCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
            />
          );
        })}
      </div>
    </div>
  );
}
