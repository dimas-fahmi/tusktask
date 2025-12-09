"use client";

import { EllipsisIcon } from "lucide-react";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { getInitial } from "@/src/lib/utils/getInitial";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";

const ProfileCard = () => {
  const { data: profile } = useGetSelfProfile();

  return (
    <div className="flex justify-between items-center">
      {/* Image & Name/Usernme */}
      <div className="flex gap-3">
        {/* Image */}
        <div className="flex-center">
          <Avatar className="w-14 h-14">
            {profile?.result?.image && (
              <AvatarImage
                src={profile?.result?.image}
                alt={`${profile?.result?.name}'s profile picture`}
              />
            )}
            <AvatarFallback>{getInitial(profile?.result?.name)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Name & Username */}
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-semibold">{profile?.result?.name}</h1>
          <p className="text-xs font-light">
            {profile?.result?.username ?? "[no-username-yet]"}
          </p>
        </div>
      </div>
      {/* Elipsis */}
      <div>
        <button type="button">
          <EllipsisIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
