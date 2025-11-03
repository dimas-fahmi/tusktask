import type React from "react";

const PublicLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return <div>{children}</div>;
};

export default PublicLayout;
