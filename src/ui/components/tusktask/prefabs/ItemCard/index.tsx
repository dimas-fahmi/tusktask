import {
  Archive,
  CalendarSync,
  Ellipsis,
  ExternalLink,
  Hash,
  Pickaxe,
  ShoppingCart,
  Signature,
  Star,
  Tag,
  Trash,
  Wallet,
} from "lucide-react";
import React from "react";
import CircularProgress from "../CircularProgress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import { FullTask } from "@/src/types/task";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "@radix-ui/react-select";

const ItemCard = ({ task }: { task: FullTask }) => {
  const Icon = task?.type === "shopping_list" ? ShoppingCart : Hash;

  return (
    <div className="px-4 py-4 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md text-sm text-muted-foreground flex items-center justify-between">
      {/* Information */}
      <div className="flex gap-1.5">
        <div className="flex items-start pt-1 gap-1.5">
          <span>
            <Icon className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="">{task?.name}</span>
          {/* Metadata */}
          <div className="gap-3 flex">
            <div className="flex items-center gap-1">
              <CircularProgress current={3} total={7} size={11} className="" />
              <span className="text-xs">3/7</span>
            </div>
            {task?.type === "shopping_list" && task?.price && (
              <div className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-xs">{task?.price}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span className="text-xs">{task?.owner?.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Signature className="w-3.5 h-3.5" />
              <span className="text-xs">{task?.creator?.username}</span>
            </div>
            {task?.claimedById && (
              <div className="flex items-center gap-1">
                <Pickaxe className="w-3.5 h-3.5" />
                <span className="text-xs">{task?.claimedBy?.username}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="cursor-pointer opacity-50 hover:opacity-100">
              <Ellipsis className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="!p-1 space-y-2">
            <PopoverAction
              Icon={ExternalLink}
              title="Open Task"
              action={() => {}}
            />
            <Separator />
            <PopoverAction Icon={Archive} title="Archive" action={() => {}} />
            <PopoverAction
              Icon={Tag}
              title="Set Status"
              subTitle={task.status}
              action={() => {}}
            />
            <PopoverAction
              Icon={CalendarSync}
              title="Reschedule"
              action={() => {}}
            />
            <Separator />
            <PopoverAction
              Icon={Trash}
              title="Move to trash"
              action={() => {}}
              variant="destructive"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ItemCard;
