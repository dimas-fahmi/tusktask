"use client";

import { Activity, useState } from "react";
import { NO_IMAGE_FALLBACK_SQUARE } from "@/src/lib/app/configs";
import type { SanitizedUserType } from "@/src/lib/zod";
import {
  Avatar,
  AvatarFallback,
  type AvatarFallbackProps,
  AvatarImage,
  type AvatarImageProps,
  type AvatarProps,
} from "@/src/ui/shadcn/components/ui/avatar";
import UserDialog from "../UserDialog";

export type AvatarButtonProps = {
  user: SanitizedUserType;
  avatarProps?: AvatarProps;
  avatarImageProps?: AvatarImageProps;
  avatarFallbackProps?: AvatarFallbackProps;
} & React.ComponentProps<"button">;

export const AvatarButton = ({
  user,
  avatarImageProps,
  avatarProps,
  avatarFallbackProps,
  ...props
}: AvatarButtonProps) => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        {...props}
        onClick={(e) => {
          props?.onClick?.(e);
          setUserDialogOpen(true);
        }}
      >
        <Avatar {...avatarProps}>
          <AvatarImage
            src={user?.image || NO_IMAGE_FALLBACK_SQUARE}
            alt={`@${user?.username || user?.name}`}
            {...avatarImageProps}
          />
          <AvatarFallback {...avatarFallbackProps}>CN</AvatarFallback>
        </Avatar>
      </button>

      <Activity mode={userDialogOpen ? "visible" : "hidden"}>
        <UserDialog
          open={userDialogOpen}
          onOpenChange={setUserDialogOpen}
          userId={user.id}
        />
      </Activity>
    </div>
  );
};
