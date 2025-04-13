"use client";

import React from "react";
import useThemeContext from "@/src/lib/tusktask/hooks/context/useThemeContext";

const LandingPage = () => {
  const { setCurrentTheme } = useThemeContext();

  return (
    <div>
      Landing Page
      <button onClick={() => setCurrentTheme("default")}>default</button>
      <button onClick={() => setCurrentTheme("cassandra-pink")}>
        casandra
      </button>
    </div>
  );
};

export default LandingPage;
