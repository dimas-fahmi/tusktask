import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";
import OverviewSection from "./sections/OverviewSection";

export const metadata: Metadata = {
  title: "We'll Remember It For You | TuskTask",
};

const LandingPage = () => {
  return (
    <div className="min-h-[1400px]">
      {/* Landing Page NavBar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Overview Section */}
      <OverviewSection />
    </div>
  );
};

export default LandingPage;
