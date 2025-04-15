"use client";

import React, { useState } from "react";

const AvatarPhase = () => {
  const [passed, setPassed] = useState(false);

  return (
    <div
      className={`${passed && "-translate-x-[1000px]"} space-y-6 transition-all duration-700`}
    >
      <header>
        <h2 className="text-3xl font-primary font-bold">Show Your Style</h2>
        <p className="text-sm text-tt-primary-foreground/70">
          Keep your current avatar or upload a fresh one—your vibe, your choice!
        </p>
      </header>
      <div></div>
    </div>
  );
};

export default AvatarPhase;
