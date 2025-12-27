"use client";

import type { SanitizedUserType } from "@/src/lib/zod";
import { AvatarButton, type AvatarButtonProps } from "../AvatarButton";

const StackedAvatars = ({
  users,
  avatarButtonProps,
}: {
  users: SanitizedUserType[];
  avatarButtonProps?: Omit<AvatarButtonProps, "user">;
}) => {
  return (
    <div className="flex -space-x-2">
      {users?.map((user) => (
        <AvatarButton
          key={user?.id || crypto.randomUUID()}
          user={user}
          {...avatarButtonProps}
        />
      ))}
    </div>
  );
};

export default StackedAvatars;
