"use client";

import { useState } from "react";
import {
  SOCIAL_PROVIDER_ENTRIES,
  type SocialProviderName,
} from "@/src/auth/social";
import SocialSignInButton from "@/src/ui/components/ui/SocialSignInButton";

const SocialSignInSection = () => {
  const [pending, setPending] = useState<SocialProviderName | null>(null);

  return (
    <section id="social" className="grid grid-cols-1 gap-2">
      {SOCIAL_PROVIDER_ENTRIES.map(([key]) => (
        <SocialSignInButton
          key={key}
          provider={key}
          {...{ pending, setPending }}
        />
      ))}
    </section>
  );
};
export default SocialSignInSection;
