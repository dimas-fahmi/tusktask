"use client";

import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import AvatarPicker from "@/src/ui/components/ui/AvatarPicker";

const ProfileSection = () => {
  const { data: profile } = useGetSelfProfile();

  return (
    <section id="profile-picture-section" className="space-y-4">
      {/* Profile Picture */}
      <div>
        <AvatarPicker />
      </div>

      {/* Name & Username */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl">Hi, {profile?.result?.name}!</h1>
        <p className="mt-1.5 font-light">
          You can costumize your settings here
        </p>
      </div>
    </section>
  );
};

export default ProfileSection;
