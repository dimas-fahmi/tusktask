import NavBar from "@/src/ui/components/tusktask/layouts/public/NavBar";
import React from "react";

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
