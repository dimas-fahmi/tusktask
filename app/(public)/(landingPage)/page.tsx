import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";

export const metadata: Metadata = {
  title: "We'll Remember It For You | TuskTask",
};

const LandingPage = () => {
  return (
    <div>
      {/* Landing Page NavBar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />
    </div>
  );
};

export default LandingPage;
