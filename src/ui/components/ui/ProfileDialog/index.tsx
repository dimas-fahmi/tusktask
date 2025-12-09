import {
  Bug,
  LogOut,
  type LucideIcon,
  MessageSquareShare,
  Settings,
  SwatchBook,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { HTMLAttributeAnchorTarget } from "react";
import { authClient } from "@/src/lib/auth/client";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useProfileDialogStore } from "@/src/lib/stores/profileDialog";
import { Avatar, AvatarImage } from "@/src/ui/shadcn/components/ui/avatar";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { ScrollArea } from "@/src/ui/shadcn/components/ui/scroll-area";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import { cn } from "@/src/ui/shadcn/lib/utils";
import ColorThemeDropdown from "../ColorThemeDropdown";

const SettingItem = ({
  icon: Icon,
  title,
  setting,
}: {
  icon: LucideIcon;
  title: string;
  setting?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2 hover:bg-muted hover:text-muted-foreground transition-all duration-300 rounded-lg text-sm">
      {/* Title & Icon */}
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {title}
      </div>

      {/* Setting */}
      <div>{setting}</div>
    </div>
  );
};

const NavigationItem = ({
  href,
  icon: Icon,
  title,
  target,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  target?: HTMLAttributeAnchorTarget;
}) => {
  const { setOpen } = useProfileDialogStore();
  return (
    <Link
      href={href}
      target={target}
      onClick={() => {
        if (target !== "_blank") {
          setOpen(false);
        }
      }}
      className="flex items-center gap-2 p-2 hover:bg-muted hover:text-muted-foreground transition-all duration-300 rounded-lg text-sm"
    >
      <Icon className="w-5 h-5" /> {title}
    </Link>
  );
};

const ButtonItem = ({
  icon: Icon,
  title,
  onClick,
  className,
}: {
  icon: LucideIcon;
  title: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-2 hover:bg-muted hover:text-muted-foreground transition-all duration-300 rounded-lg text-sm w-full",
        className,
      )}
    >
      <Icon className="w-5 h-5" /> {title}
    </button>
  );
};

const ProfileDialog = () => {
  const { data: profile, isPending: _isLoadingProfile } = useGetSelfProfile();
  const { open, setOpen: onOpenChange } = useProfileDialogStore();
  const router = useRouter();

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className="flex flex-col">
        <DialogHeader className="flex h-fit m-0 p-0 flex-col items-center">
          <Avatar className="w-32 h-32">
            {profile?.result?.image && (
              <AvatarImage
                src={profile?.result?.image}
                alt={`${profile?.result?.name}'s profile picture`}
              />
            )}
          </Avatar>
          <div>
            <DialogTitle className="font-header text-2xl">
              {profile?.result?.name}
            </DialogTitle>
            <DialogDescription>
              {profile?.result?.username ?? "[no-username-yet]"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="h-62 pe-2">
          <div className="space-y-2">
            <SettingItem
              icon={SwatchBook}
              title="Color Theme"
              setting={
                <ColorThemeDropdown
                  classNames={{ triggerClassNames: "text-xs" }}
                />
              }
            />

            <Separator />
            <NavigationItem
              icon={MessageSquareShare}
              title="Send a feedback"
              href="https://github.com/dimas-fahmi/tusktask/issues?q=is%3Aissue%20state%3Aopen%20label%3Afeedback"
              target="_blank"
            />
            <NavigationItem
              icon={Bug}
              title="Report a bug"
              href="https://github.com/dimas-fahmi/tusktask/issues?q=is%3Aissue%20state%3Aopen%20label%3Afeedback"
              target="_blank"
            />
            <NavigationItem
              icon={Settings}
              title="Settings"
              href="/dashboard/settings"
            />
            <ButtonItem
              icon={LogOut}
              title="Sign Out"
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/auth");
                    },
                  },
                });
              }}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            />
          </div>
        </ScrollArea>

        {/* Footer */}
        <footer>
          <DialogClose asChild>
            <Button className="w-full">Close</Button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
