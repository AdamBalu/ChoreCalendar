"use client";

import { signIn } from "next-auth/react";
import { CalendarDays, CheckCircle2, Sparkles, LogIn } from "lucide-react";

export function LandingScreen() {
  return (
    <div className="landing-page-wrapper">
      <div className="landing-page">
        <div className="landing-content">
          {/* Logo and Title */}
          <div className="landing-header">
            <img
              src="/chore-calendar-logo.png"
              alt="Chore Calendar"
              className="landing-logo"
            />
            <h1 className="landing-title">Chore Calendar</h1>
            <p className="landing-tagline">
              Organize your daily tasks. Track your progress. Stay motivated.
            </p>
          </div>

          {/* Features */}
          <div className="landing-features">
            <div className="landing-feature">
              <CalendarDays className="landing-feature-icon" />
              <div>
                <h3>Drag & Drop Calendar</h3>
                <p>Schedule chores by dragging them onto any day</p>
              </div>
            </div>
            <div className="landing-feature">
              <CheckCircle2 className="landing-feature-icon" />
              <div>
                <h3>Daily Progress Tracking</h3>
                <p>Set goals and watch your progress grow each day</p>
              </div>
            </div>
            <div className="landing-feature">
              <Sparkles className="landing-feature-icon" />
              <div>
                <h3>Custom Icons</h3>
                <p>Personalize chores with emojis or your own images</p>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button onClick={() => signIn()} className="landing-signin-btn">
            <LogIn size={20} />
            <span>Sign In to Get Started</span>
          </button>

          <p className="landing-note">
            Sign in to sync your chores across devices and never lose your
            progress.
          </p>
        </div>

        {/* Decorative background elements */}
        <div className="landing-bg-gradient" />
      </div>

      {/* App Showcase Section */}
      <div className="landing-showcase">
        <img
          src="/chore-calendar-design.png"
          alt="Chore Calendar App Preview"
          className="landing-showcase-image"
        />
        <div className="landing-showcase-fade" />
      </div>
    </div>
  );
}
