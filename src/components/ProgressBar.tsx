"use client";

interface ProgressBarProps {
  current: number;
  target: number;
  showValue?: boolean;
}

export function ProgressBar({
  current,
  target,
  showValue = true,
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;
  const isOverflow = current > target;

  return (
    <div className="progress-bar-container">
      <div
        className={`progress-bar ${isComplete ? "complete" : ""} ${isOverflow ? "overflow" : ""}`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className={`progress-bar-value ${isComplete ? "complete" : ""}`}>
          {current}/{target}
        </div>
      )}
    </div>
  );
}
