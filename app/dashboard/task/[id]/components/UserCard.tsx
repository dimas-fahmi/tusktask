import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import { getUserInitials } from "@/src/lib/tusktask/utils/getUserInitials";
import { SanitizedUser } from "@/src/lib/tusktask/utils/sanitizeUserData";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { Badge } from "@/src/ui/components/shadcn/ui/badge";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import React from "react";

const UserCardSkeleton = () => {
  return (
    <div className="border flex items-center gap-2 p-4 rounded-md">
      <div>
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <div className="w-full h-full">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div>
          <Skeleton className="h-4 w-24 rounded mb-1" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div>
          <Skeleton className="h-2 w-12 rounded" />
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, label }: { user?: SanitizedUser; label: string }) => {
  return !user ? (
    <UserCardSkeleton />
  ) : (
    <div className="border flex items-center gap-2 p-4 rounded-md">
      {/* Avatar */}
      <div>
        <Avatar className="w-9 h-9">
          <AvatarImage
            src={user?.image ?? DEFAULT_AVATAR}
            alt={`${user?.name ?? "user"}'s Avatar`}
          />
          <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between w-full">
        {/* Start */}
        <div>
          <h1 className="font-semibold">{truncateText(user?.name ?? "", 2)}</h1>
          <p className="text-xs text-muted-foreground">{user?.username}</p>
        </div>

        {/* End */}
        <div>
          <Badge>{label}</Badge>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
