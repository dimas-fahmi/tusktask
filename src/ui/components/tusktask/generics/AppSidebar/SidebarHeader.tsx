"use client";

import React from "react";
import { Button } from "../../../shadcn/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import { Ellipsis } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";

const SidebarHeader = () => {
  const { data: session, status } = useSession();

  return status === "loading" ? (
    <div className="grid grid-cols-[50px_auto] gap-2.5">
      <div className="relative bg-tt-muted w-[50px] h-[50px] rounded-full overflow-hidden animate-pulse" />
      <div className="flex items-center justify-between pe-2">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-tt-muted rounded animate-pulse" />
          <div className="h-3 w-24 bg-tt-muted rounded animate-pulse" />
        </div>
        <Ellipsis className="text-tt-muted animate-pulse" />
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-[50px_auto] gap-2.5">
      <div className="relative bg-tt-muted w-[50px] h-[50px] rounded-full overflow-hidden">
        <Avatar className="w-[50px] h-[50px]">
          <AvatarImage
            src={
              session?.user.image ??
              "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/defaults-avatar.jpg"
            }
            alt="@shadcn"
          />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center justify-between pe-2">
        <div>
          <h4 className="text-sm font-semibold font-primary">
            {session?.user.firstName} {session?.user.lastName}
          </h4>
          <p className="text-xs">{session?.user.userName}</p>
        </div>
        <Popover>
          <PopoverTrigger className="cursor-pointer">
            <Ellipsis />
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Account Settings</h4>
                <p className="text-sm text-tt-muted-foreground">
                  Imagination governs the world - Napoleon Bonaparte
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button variant={"outline"}>Profile</Button>
              <Button variant={"outline"}>Settings</Button>
              <Button onClick={() => signOut()} variant={"destructive"}>
                Log Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export { SidebarHeader };
