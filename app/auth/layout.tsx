import type React from "react";

const AuthLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return <div>{children}</div>;
};

export default AuthLayout;
