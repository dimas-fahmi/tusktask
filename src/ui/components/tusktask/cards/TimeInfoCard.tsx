import { formatDateToString } from "@/src/lib/tusktask/utils/date/formatDateToString";
import { getTimeAgo } from "@/src/lib/tusktask/utils/date/getTimeAgo";
import { LucideIcon } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/ui/dialog";
import { DatePicker } from "../../shadcn/manuals/DatePicker";
import { Separator } from "../../shadcn/ui/separator";
import { Button } from "../../shadcn/ui/button";

interface TimeInfoCardProps {
  date: Date | null | undefined;
  label: string;
  icon: LucideIcon;
}

const TimeInfoCard: React.FC<TimeInfoCardProps> = ({
  date,
  icon: Icon,
  label,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border p-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-3 w-full max-w-md cursor-pointer shadow-md">
          <div className="flex-shrink-0">
            <Icon className="text-gray-500" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">{label}</span>
              <span className="text-xs text-gray-500">{getTimeAgo(date)}</span>
            </div>
            <div className="text-xs text-gray-700 mt-1">
              {date ? <>{formatDateToString(date)}</> : <>Not Set</>}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Timestamp</DialogTitle>
          <DialogDescription>
            Make changes to your task, and click save when you're done
          </DialogDescription>
        </DialogHeader>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-0.5 text-sm">
              <label htmlFor="startAt">Start Time</label>
              <DatePicker placeholder="Start Time" />
            </div>
            <div className="flex flex-col gap-0.5 text-sm">
              <label htmlFor="deadlineAt">Deadline Time</label>
              <DatePicker placeholder="Deadline Time" />
            </div>

            <Separator />
          </div>
          <DialogFooter className="mt-4">
            <DialogTrigger asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button>Save</Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeInfoCard;
