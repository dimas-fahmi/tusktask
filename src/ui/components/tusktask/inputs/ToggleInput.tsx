"use client";

import React from "react";

export interface ToggleInput {
  value: boolean;
  onClick: () => void;
  disable: boolean;
}

const ToggleInput: React.FC<ToggleInput> = ({ onClick, value, disable }) => {
  return (
    <div
      onClick={!disable ? onClick : () => {}}
      className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        value ? "bg-tt-secondary" : "bg-tt-muted"
      } ${disable ? "opacity-50" : ""}`}
    >
      <div
        className={`w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${
          value
            ? "translate-x-0 bg-tt-secondary-foreground"
            : "translate-x-8 bg-tt-muted-foreground"
        }`}
      />
    </div>
  );
};

export default ToggleInput;
