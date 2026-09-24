"use client";

import { SOCIAL_PROVIDER_ENTRIES } from "@/src/auth/social";
import SocialSignInButton from "@/src/ui/components/ui/SocialSignInButton";

const SocialSignInSection = () => {
  return (
    <section id="social" className="grid grid-cols-1 gap-2">
      {SOCIAL_PROVIDER_ENTRIES.map(([key]) => (
        <SocialSignInButton key={key} provider={key} />
      ))}
    </section>
  );
};
export default SocialSignInSection;
