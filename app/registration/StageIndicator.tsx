import React from "react";
import { CircleCheckBig } from "lucide-react";

const StageIndicator = ({
  active,
  length,
  className = "",
}: {
  active: number;
  length: number;
  className?: string;
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <span
          key={index}
          className={`block w-9 ${index === active - 1 ? "bg-primary" : "bg-primary/20"} h-1.5 rounded-md`}
        />
      ))}

      {active === length ? (
        <>
          <CircleCheckBig />
        </>
      ) : (
        <span className="text-xs text-muted-foreground">
          {active}/{length}
        </span>
      )}
    </div>
  );
};

export default StageIndicator;
