import type React from "react";

const AuthLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <div className="grid grid-cols-1 min-h-dvh">
      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
