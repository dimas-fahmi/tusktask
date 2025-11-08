import type React from "react";
import Footer from "./components/Footer";

const PublicLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <div>
      {children}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
