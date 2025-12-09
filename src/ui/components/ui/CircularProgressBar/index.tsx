import type React from "react";

interface CircularProgressBarProps {
  /** The current value of the progress */
  current: number;
  /** The total value (100%) */
  total: number;
  /** The diameter of the circle in pixels. Default: 128 */
  size?: number;
  /** Thickness of the progress bar line. Default: 8 */
  strokeWidth?: number;
  /** Tailwind text color class for the progress bar (e.g., 'text-blue-600'). */
  color?: string;
  /** Tailwind text color class for the empty background circle. */
  backgroundColor?: string;
  /** Whether to show the percentage in the center or the custom label */
  showPercentage?: boolean;
  /** Custom label content. If provided, overrides percentage. */
  children?: React.ReactNode;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  current,
  total,
  size = 128,
  strokeWidth = 10,
  color = "text-primary",
  backgroundColor = "text-muted",
  showPercentage = true,
  children,
}) => {
  // 1. Calculate Percentage and clamp it between 0 and 100
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  // 2. SVG Configuration
  // We use a fixed viewBox size of 100x100 for easy calculations,
  // then scale the whole SVG via CSS width/height props.
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 3. Calculate Stroke Offset
  // This determines how much of the stroke is visible based on percentage
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* SVG Container */}
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <title>Circular Progress Bar</title>
        {/* Background Circle */}
        <circle
          className={`${backgroundColor} transition-colors duration-300 ease-in-out`}
          stroke="currentColor"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <circle
          className={`${color} transition-all duration-500 ease-out`}
          stroke="currentColor"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ? (
          children
        ) : showPercentage ? (
          <span className="text-xl font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default CircularProgressBar;
