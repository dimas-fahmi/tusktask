import type { Metadata } from "next";
import OnboardingPageIndex from "./OnboardingPageIndex";

export const metadata: Metadata = {
  title: "Welcome to TuskTask | Onboarding",
};

const OnboardingPage = () => {
  return <OnboardingPageIndex />;
};

export default OnboardingPage;
