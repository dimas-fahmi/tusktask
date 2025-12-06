"use client";

import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { Switch } from "@/src/ui/shadcn/components/ui/switch";

const SoundToggler = () => {
  const { data: profileResponse } = useGetSelfProfile();
  const profile = profileResponse?.result;

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <div>
      <Switch
        checked={!profile?.isSilent}
        onCheckedChange={(checked) => {
          updateProfile({ isSilent: !checked });
        }}
        disabled={isUpdatingProfile}
      />
    </div>
  );
};

export default SoundToggler;
