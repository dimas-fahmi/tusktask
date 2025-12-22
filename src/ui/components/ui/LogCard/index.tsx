"use client";

import { ChevronDown, Dot } from "lucide-react";
import { DateTime } from "luxon";
import { motion } from "motion/react";
import { useState } from "react";
import type { ExtendedNotificationType } from "@/src/lib/app/app";
import { EVENTS_METADATA } from "@/src/lib/app/configs";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { cn } from "@/src/ui/shadcn/lib/utils";
import Message from "./sections/Message";

export const LogCard = ({ log }: { log: ExtendedNotificationType }) => {
  const [expand, setExpand] = useState(false);

  const { payload } = log;
  const eventMetadata = EVENTS_METADATA[payload.event];
  const Icon = eventMetadata.icon;

  return (
    <>
      {/* Card */}
      <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
        {/* Icon & Info */}
        <div className="flex gap-2 items-center">
          {/* Icon */}
          <div>
            <Icon />
          </div>

          {/* Info */}
          <div>
            <h1>{eventMetadata.labelProjectLog}</h1>

            <div className="text-xs font-light flex gap-0.5 items-center">
              <span>{log?.actor?.username}</span>
              <Dot className="w-3 h-3" />
              <span>
                {DateTime.fromJSDate(new Date(log.createdAt)).toRelative()}
              </span>
            </div>
          </div>
        </div>

        {/* Expand */}
        <div>
          <Button
            variant={"outline"}
            className={cn(
              "w-8 h-8 flex-center",
              `${expand ? "rotate-z-180" : ""} transition-all duration-300`,
            )}
            aria-label="Toggle expand mode for more information"
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <ChevronDown />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, marginTop: 0 }}
        animate={
          expand
            ? { height: "auto", marginTop: "1rem" }
            : { height: 0, marginTop: 0 }
        }
        transition={
          expand
            ? {
                duration: 0.8,
                type: "spring",
                stiffness: 80,
                damping: 8,
              }
            : {
                duration: 0.3,
              }
        }
        className="overflow-hidden"
      >
        {/* wrapper */}
        <div className="p-4 pt-0 space-y-6">
          {/* Message Container */}
          <Message message={log?.payload?.message} />
        </div>
      </motion.div>
    </>
  );
};
