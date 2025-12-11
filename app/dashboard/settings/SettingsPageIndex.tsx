"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useActiveSections } from "@/src/lib/hooks/useActiveSection";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import { SettingIndexItem } from "./components/SettingsIndexItem";
import AccountsSection from "./sections/AccountsSection";
import ActiveSessionsSection from "./sections/ActiveSessionsSection";
import AdvanceSection from "./sections/AdvanceSection";
import NameSection from "./sections/NameSection";
import PreferencesSection from "./sections/PreferencesSection";
import ProfileSection from "./sections/ProfileSection";
import UsernameSection from "./sections/UsernameSection";

const sectionIds = [
  "profile-picture-section",
  "name-section",
  "username-section",
  "preferences-section",
  "accounts-section",
  "active-sessions-section",
  "advance-section",
] as const;

const sectionTitles: Record<(typeof sectionIds)[number], string> = {
  "profile-picture-section": "Profile Picture",
  "accounts-section": "Accounts",
  "active-sessions-section": "Active Sessions",
  "name-section": "Name & Display Name",
  "username-section": "Unique Username",
  "preferences-section": "Preferences",
  "advance-section": "Advance",
};

const SettingsPageIndex = () => {
  const searchParams = useSearchParams();
  const scrollTo = searchParams.get("scrollTo");
  const active = useActiveSections(sectionIds, 0);

  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo) as HTMLElement;

      if (!el) return;

      window.scrollTo({
        top: el.offsetTop - 50,
        behavior: "smooth",
      });
    }
  }, [scrollTo]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_280px] gap-12">
      <div className="space-y-6 md:space-y-12">
        {/* Header */}
        <header>
          <h1 className="text-4xl">Settings</h1>
          <p>Change your preferences and account settings</p>
        </header>

        {/* Profile Section */}
        <ProfileSection />
        <Separator />

        {/* Name Section */}
        <NameSection />
        <Separator />

        {/* Username Section */}
        <UsernameSection />
        <Separator />

        {/* Preferences Section */}
        <PreferencesSection />
        <Separator />

        {/* Accounts Section */}
        <AccountsSection />
        <Separator />

        {/* Active Session Section */}
        <ActiveSessionsSection />
        <Separator />

        {/* Advance Section */}
        <AdvanceSection />
        <Separator />
      </div>

      {/* Index */}
      <div className="hidden md:block">
        <div className="sticky top-5 space-y-4">
          <h1 className="text-xl">Settings</h1>
          <div className="flex flex-col gap-2">
            {sectionIds.map((id) => (
              <SettingIndexItem
                key={id}
                href={`#${id}`}
                title={sectionTitles[id]}
                isActive={active === id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPageIndex;
