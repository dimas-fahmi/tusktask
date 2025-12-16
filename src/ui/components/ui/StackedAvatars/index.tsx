import { NO_IMAGE_FALLBACK_SQUARE } from "@/src/lib/app/configs";
import type { SanitizedUserType } from "@/src/lib/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";

const AvatarButton = ({ user }: { user: SanitizedUserType }) => {
  return (
    <button type="button">
      <Avatar>
        <AvatarImage
          src={user?.image || NO_IMAGE_FALLBACK_SQUARE}
          alt={`@${user?.username || user?.name}`}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </button>
  );
};

const StackedAvatars = ({ users }: { users: SanitizedUserType[] }) => {
  return (
    <div className="flex -space-x-2">
      {users?.map((user) => (
        <AvatarButton key={user?.id || crypto.randomUUID()} user={user} />
      ))}
    </div>
  );
};

export default StackedAvatars;
