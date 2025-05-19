import React from "react";
import NavBar from "./NavBar";

const PublicLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="max-w-[1440px] mx-auto">
      <NavBar />
      {children}
    </div>
  );
};

export default PublicLayout;
