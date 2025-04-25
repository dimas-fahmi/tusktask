"use client";

import { SpecificTask } from "@/app/api/tasks/types";
import { fetchSpecificTask } from "@/src/lib/tusktask/fetchers/fetchSpecificTask";
import MainLoader from "@/src/ui/components/tusktask/animation/MainLoader";
import TaskCheckButton from "@/src/ui/components/tusktask/buttons/TaskCheckButton";
import AssigneeCard from "@/src/ui/components/tusktask/cards/AssigneeCard";
import TimeInfoCard from "@/src/ui/components/tusktask/cards/TimeInfoCard";
import { useQuery } from "@tanstack/react-query";
import { Clock9, ClockAlert, ClockArrowUp, Text } from "lucide-react";
import Image from "next/image";
import React from "react";

const TaskPageIndex = ({ id }: { id: string }) => {
  console.log(id);
  const { data, isFetching } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchSpecificTask(id),
  });

  const taskData = data && (data.data as SpecificTask | null);

  return isFetching && !taskData ? (
    <div className="flex justify-center items-center">
      <Image
        width={80}
        height={80}
        src={"/images/loader.gif"}
        alt="Loading Animation"
      />
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-[auto_280px] gap-6 md:gap-0">
      <div className="space-y-6">
        <header className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-lg md:text-3xl font-bold text-tt-primary-foreground/80 capitalize">
              <TaskCheckButton
                taskId={taskData?.id ?? ""}
                completedAt={taskData?.completedAt}
              />
              {taskData?.name}
            </h1>
          </div>
        </header>
        <div>
          <section id="description">
            <p className="flex items-center gap-2 text-sm text-tt-primary-foreground/70">
              <Text className="w-4 h-4" />{" "}
              {taskData &&
              taskData.description &&
              taskData?.description?.length > 0
                ? taskData?.description
                : "description"}
            </p>
          </section>
        </div>
      </div>
      <div className="space-y-6">
        <section id="asignees">
          <h4 className="font-semibold">Assignee</h4>

          <div className="space-y-2">
            {taskData?.users.map((user) => (
              <AssigneeCard
                key={user?.id}
                name={user.name ?? ""}
                username={user.userName ?? ""}
                avatar={user.image ?? ""}
              />
            ))}
          </div>
        </section>

        <section id="timestamps" className="space-y-2">
          <h4 className="font-semibold">Timestamps</h4>

          <div className="space-y-2">
            <TimeInfoCard
              icon={Clock9}
              label="Created At"
              date={taskData?.createdAt}
            />
            <TimeInfoCard
              icon={ClockArrowUp}
              label="Start At"
              date={taskData?.createdAt}
            />
            <TimeInfoCard
              icon={ClockAlert}
              label="Deadline At"
              date={taskData?.deadlineAt}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TaskPageIndex;
