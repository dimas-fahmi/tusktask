"use client";

import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { getFirstName } from "@/src/lib/utils/getNames";
import AvatarPicker from "@/src/ui/components/ui/AvatarPicker";

const ProfileSection = () => {
  const { data: profile } = useGetSelfProfile();
  const name = getFirstName(profile?.result);

  return (
    <section id="profile-picture-section" className="space-y-4">
      {/* Profile Picture */}
      <div>
        <AvatarPicker />
      </div>

      {/* Name & Username */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl">Hi, {name}!</h1>
        <p className="mt-1.5 font-light">
          You can costumize your settings here
        </p>
      </div>
    </section>
  );
};

export default ProfileSection;
