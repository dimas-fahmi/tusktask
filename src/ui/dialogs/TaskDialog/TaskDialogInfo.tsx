"use client";

import { IconDots } from "@tabler/icons-react";
import { formatDate, formatDistance } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { id } from "date-fns/locale/id";
import { useLocale, useTranslations } from "next-intl";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import { Button } from "../../shadcn/components/ui/button";
import TaskDialogControlSection from "./TaskDialogControlSection";

const dateLocale = {
  en: enUS,
  id: id,
};

const TimeCard = ({
  distance,
  formatted,
}: {
  formatted: string;
  distance: string;
}) => {
  return (
    <div>
      <p className="text-sm font-semibold">{formatted}</p>
      <small className="text-xs font-extralight opacity-80">
        {`${distance.charAt(0).toUpperCase()}${distance.slice(1)}`}
      </small>
    </div>
  );
};

const TaskDialogInfo = ({
  taskDetail,
}: {
  taskDetail: GetTaskDetailProcResult;
}) => {
  const locale = useLocale();
  const t = useTranslations();

  const now = Date.now();

  return (
    <>
      {/* Owner */}
      <TaskDialogControlSection title="Owner">
        <div className="flex items-center gap-2 p-2 border rounded-md">
          <Avatar>
            {taskDetail.user.image && (
              <AvatarImage src={taskDetail.user.image} />
            )}
            <AvatarFallback>
              {taskDetail.user.name?.[0] || "N/A"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex items-center justify-between">
            <div>
              <h3>{taskDetail.user.name}</h3>
              <p className="text-xs font-light opacity-70">
                {taskDetail.user.username}
              </p>
            </div>

            <Button variant={"ghost"} size={"icon-xs"} disabled>
              <IconDots />
            </Button>
          </div>
        </div>
      </TaskDialogControlSection>

      {/* Start At */}
      <TaskDialogControlSection title="Start">
        {taskDetail?.startAt ? (
          <TimeCard
            formatted={formatDate(taskDetail.startAt, "PPp", {
              locale: dateLocale[locale],
            })}
            distance={formatDistance(taskDetail.startAt, now, {
              locale: dateLocale[locale],
              addSuffix: true,
            })}
          />
        ) : (
          t("common.not_set")
        )}
      </TaskDialogControlSection>

      {/* Deadline At */}
      <TaskDialogControlSection title="Deadline">
        {taskDetail?.deadlineAt ? (
          <TimeCard
            formatted={formatDate(taskDetail.deadlineAt, "PPp", {
              locale: dateLocale[locale],
            })}
            distance={formatDistance(taskDetail.deadlineAt, now, {
              locale: dateLocale[locale],
              addSuffix: true,
            })}
          />
        ) : (
          t("common.not_set")
        )}
      </TaskDialogControlSection>

      {/* Priority */}
      <TaskDialogControlSection title="Priority">
        <span>Not Set</span>
      </TaskDialogControlSection>
    </>
  );
};
export default TaskDialogInfo;
