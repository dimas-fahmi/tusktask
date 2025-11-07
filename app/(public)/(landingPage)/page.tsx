import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import FeatureSection from "./sections/FeatureSection";
import HeroSection from "./sections/HeroSection";
import OverviewSection from "./sections/OverviewSection";
import TestimoniesSection from "./sections/TestimoniesSection";

export const metadata: Metadata = {
  title: "We'll Remember It For You | TuskTask",
};

const LandingPage = () => {
  return (
    <div className="min-h-[10400px]">
      {/* Landing Page NavBar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Overview Section */}
      <OverviewSection />

      {/* Testimony Section */}
      <TestimoniesSection />

      {/* Feature Section */}
      <FeatureSection />
    </div>
  );
};

export default LandingPage;
