import React, { useState } from "react";

const UsernamePhase = () => {
  const [passed, setPassed] = useState(false);

  return (
    <div
      className={`${passed && "-translate-x-[1000px]"} space-y-6 transition-all duration-700`}
    >
      <header>
        <h2 className="text-3xl font-primary font-bold">Pick Your Username</h2>
        <p className="text-sm text-tt-primary-foreground/70">
          Choose something fun—it’s how you’ll shine here!
        </p>
      </header>
      <div></div>
    </div>
  );
};

export default UsernamePhase;
