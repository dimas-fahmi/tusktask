import React from "react";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  current: number;
  size?: number; // Size of the circle in px (default 40)
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  total,
  current,
  size = 40,
  className,
  ...divProps
}) => {
  // Calculate progress as a fraction (0 to 1)
  const progress = Math.min(current / total, 1);

  // SVG circle parameters
  const cx = 18; // Center x
  const cy = 18; // Center y
  const r = 16; // Radius

  // Calculate the end point of the arc for the filled sector
  const angle = progress * 2 * Math.PI; // Angle in radians
  const x = cx + r * Math.sin(angle); // End x-coordinate
  const y = cy - r * Math.cos(angle); // End y-coordinate
  const largeArcFlag = progress > 0.5 ? 1 : 0; // Use large arc if progress > 50%

  // Define the path for the filled sector (only if progress > 0)
  const pathD =
    progress > 0
      ? `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArcFlag} 1 ${x} ${y} Z`
      : "";

  return (
    <div
      className={`relative inline-block ${className || ""}`}
      style={{ width: size, height: size }}
      {...divProps}
    >
      <svg width={size} height={size} viewBox="0 0 36 36">
        {/* Filled sector (only rendered if progress > 0) */}
        {progress > 0 && <path d={pathD} fill="currentColor" stroke="none" />}
        {/* Border circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
