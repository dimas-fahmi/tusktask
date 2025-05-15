import { SpecificTask } from "@/app/api/tasks/types";
import React from "react";
import TaskInformation from "./sections/TaskInformation";
import TaskTitle from "./sections/TaskTitle";
import SubTasks from "./sections/SubTasks";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/ui/components/shadcn/ui/breadcrumb";
import Link from "next/link";

const TaskPageContent = ({ taskData }: { taskData: SpecificTask }) => {
  return (
    <div className="space-y-6 md:pe-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={"/dashboard"}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {taskData.parent?.parent && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbEllipsis />
            </>
          )}
          {taskData?.parent && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/dashboard/task/${taskData.parent.id}`}>
                    {taskData.parent.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{taskData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <TaskTitle taskData={taskData} />
        </div>
      </header>
      <div></div>
      {/* [Section] Task Information */}
      <TaskInformation taskData={taskData} />

      {/* [Section] Sub Tasks */}
      <SubTasks taskData={taskData} />
    </div>
  );
};

export default TaskPageContent;
