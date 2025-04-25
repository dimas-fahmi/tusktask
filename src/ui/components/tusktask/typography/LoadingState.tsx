import { LoaderCircle } from "lucide-react";
import React from "react";

const LoadingState = ({ title = "Loading" }) => {
  return (
    <span className="flex items-center gap-1">
      <span className="animate-spin">
        <LoaderCircle />
      </span>
      {title}
    </span>
  );
};

export default LoadingState;
