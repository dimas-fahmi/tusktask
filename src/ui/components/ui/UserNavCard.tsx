"use client";

import {
  IconBell,
  IconDots,
  IconLogout,
  IconSettings,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import route from "@/src/app/route";
import { authClient } from "@/src/auth/client";
import { useMyData } from "@/src/hooks/useMyData";
import { useQuickSettings } from "@/src/hooks/useQuickSettings";
import { getUserRank } from "@/src/utils/getUserRank";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";
import { Skeleton } from "../../shadcn/components/ui/skeleton";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";
import UserPointCard from "./UserPointCard";

const UserNavCardSkeleton = () => {
  return (
    <div className="border p-2 rounded-md flex items-center gap-2">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex items-center justify-between flex-1">
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-14" />
        </div>

        <IconDots className="opacity-20 animate-pulse w-4 h-4" />
      </div>
    </div>
  );
};

const UserNavCard = () => {
  const t = useTranslations();
  const { data: myData, isPending } = useMyData();

  const isMobile = useIsMobile();

  const openQSD = useQuickSettings((s) => s.openDialog);

  const rank = getUserRank(myData?.points ?? 0);

  const router = useRouter();

  return isPending ? (
    <UserNavCardSkeleton />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            className="group/button border p-2 rounded-md flex items-center gap-2 text-start"
          >
            <Avatar className={"w-9 h-9"}>
              {myData?.image && <AvatarImage src={myData.image} />}
              <AvatarFallback>{myData?.name?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-sm">{myData?.name}</h1>
                <p className="text-xs font-light opacity-70">
                  {t(`rank.${rank.id}.title`)}
                </p>
              </div>

              <IconDots className="w-4 h-4 opacity-50 group-hover/button:opacity-100 hover:scale-105 transition-all duration-300" />
            </div>
          </button>
        )}
      />

      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={6}
        alignOffset={2}
        className={"md:min-w-xs"}
      >
        <div className="flex gap-2 mb-2 py-1 px-2">
          <Avatar className={"w-9 h-9"}>
            {myData?.image && <AvatarImage src={myData.image} />}
            <AvatarFallback>{myData?.name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 flex items-center justify-between">
            <div className="w-full space-y-4">
              <div>
                <h1 className="text-sm">{myData?.name}</h1>
                <p className="text-xs font-extralight">{myData?.username}</p>
              </div>
              <UserPointCard />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconWallet /> {t("common.become_a_sponsor")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUser />
            {t("common.account_settings")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openQSD();
            }}
          >
            <IconSettings />
            {t("common.quick_settings")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconBell />
            {t("common.notifications")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push(route.signin());
                  },
                },
              });
            }}
          >
            <IconLogout />
            {t("common.sign_out")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserNavCard;
