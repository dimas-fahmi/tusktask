"use client";

import { IconHelpCircle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMyData } from "@/src/hooks/useMyData";
import { useRank } from "@/src/hooks/useRankDialog";
import { getNextRank, getUserRank } from "@/src/utils/getUserRank";
import { Button } from "../../shadcn/components/ui/button";
import { Progress } from "../../shadcn/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcn/components/ui/tooltip";

const UserPointCard = () => {
  const t = useTranslations();
  const { data: myData } = useMyData();
  const currentPoint = myData?.points ?? 0;
  const rank = getUserRank(currentPoint);
  const nextRank = getNextRank(currentPoint);

  const setRankDialogOpen = useRank((s) => s.setOpen);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extralight">
          {t(`rank.${rank.id}.title`)}
        </span>

        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <span {...props}>
                <IconHelpCircle className="w-4 h-4" />
              </span>
            )}
          />

          <TooltipContent className={"max-w-xs"}>
            <div className="space-y-3">
              <div>
                <h1 className="font-semibold">{t(`rank.${rank.id}.title`)}</h1>
                <p className="text-xs">{t(`rank.${rank.id}.description`)}</p>
              </div>

              <Button
                variant={"secondary"}
                size={"xs"}
                className={"w-full"}
                onClick={() => {
                  setRankDialogOpen(true);
                }}
              >
                More information about rank
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <Progress value={myData?.points ?? 0} max={1000} className={"h-1.5"} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-extralight">100</span>
        <span className="text-xs font-extralight">{nextRank?.min}</span>
      </div>
    </div>
  );
};
export default UserPointCard;
