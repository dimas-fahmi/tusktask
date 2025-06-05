import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { Button } from "../../../shadcn/ui/button";
import { Minimize } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { SetStateAction } from "@/src/types/types";
import { ScrollArea } from "../../../shadcn/ui/scroll-area";

type FilterType = "all" | "teams" | "tasks" | "unreads";

const FilterButton = ({
  text,
  filter,
  action,
}: {
  text: FilterType;
  filter: FilterType;
  action: SetStateAction<FilterType>;
}) => {
  return (
    <button
      className={`${filter === text ? "active font-semibold" : ""} capitalize underline-effect py-2 cursor-pointer ${text === "tasks" && "hidden md:block"}`}
      onClick={() => action(text)}
    >
      {text}
    </button>
  );
};

const NotificationsDialog = () => {
  // Pull states from notification contexttext === "all" ? "Show All" :
  const { notificationsDialogOpen, setNotificationsDialogOpen, received } =
    useNotificationContext();

  console.log(received);

  // Filter State
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <Dialog
      open={notificationsDialogOpen}
      onOpenChange={setNotificationsDialogOpen}
    >
      <DialogContent className="p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">Notifications Dialog</DialogTitle>
        <DialogDescription className="sr-only">Notifications</DialogDescription>

        <div className="">
          {/* Header */}
          <header className="grid grid-cols-1 gap-1 bg-primary text-primary-foreground">
            {/* Top Section */}
            <section
              id="topHeader"
              className="flex items-center justify-between px-4 py-4"
            >
              <h1 className="text-xl font-bold">Notifications</h1>

              <Button
                variant={"ghost"}
                onClick={() => setNotificationsDialogOpen(false)}
              >
                <Minimize />
              </Button>
            </section>

            {/* Controller Section */}
            <section id="controller" className="grid grid-cols-4">
              <FilterButton filter={filter} action={setFilter} text="all" />
              <FilterButton filter={filter} action={setFilter} text="tasks" />
              <FilterButton filter={filter} action={setFilter} text="teams" />
              <FilterButton filter={filter} action={setFilter} text="unreads" />
            </section>
          </header>

          {/* Main */}
          <ScrollArea className="w-full h-[420px]">
            {received &&
              received.map((notification) => (
                <NotificationCard
                  notification={notification}
                  key={notification.id}
                />
              ))}

            {received.length === 0 && (
              <p className="text-center text-sm opacity-60 p-4">
                No notifications
              </p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
