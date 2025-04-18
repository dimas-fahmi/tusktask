import { Avatar, AvatarImage } from "@/src/ui/components/shadcn/ui/avatar";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import { Bell, Sidebar } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const LayoutHeader = () => {
  const { data: session } = useSession();
  const { open, openMobile, setOpenMobile, setOpen } = useSidebar();
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowHint(false);
    }, 5000);
  }, []);

  return (
    <header className="mb-9 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <button
          className="w-fit cursor-pointer hover:text-tt-secondary py-2 rounded-full text-tt-primary-foreground/80"
          onClick={() => {
            setOpenMobile(!openMobile);
            setOpen(!open);
          }}
        >
          <Sidebar className="w-6 h-6 lg:w-5 lg:h-5" />
        </button>
        <div
          className={`${showHint ? "" : "opacity-0"} transition-all duration-700 hidden md:block text-xs text-tt-primary-foreground/70`}
        >
          open/close{" "}
          <span className="bg-muted py-1 px-2 rounded-md">Ctrl+B</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-fit p-2 rounded-full text-tt-primary-foreground/80">
          <Bell className="w-6 h-6 lg:w-5 lg:h-5" />
        </div>
        <Avatar className="w-[40px] h-[40px]">
          <AvatarImage src={session?.user.image ?? ""} alt="Avatar" />
        </Avatar>
      </div>
    </header>
  );
};

export default LayoutHeader;
