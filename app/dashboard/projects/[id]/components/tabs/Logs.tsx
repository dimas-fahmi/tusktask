"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Frown, Loader, Logs, UserRound } from "lucide-react";
import { queryIndex } from "@/src/lib/queries";
import { LogCard } from "@/src/ui/components/ui/LogCard";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useProjectDetailPageIndexContext } from "../../ProjectDetailPageIndex";

const LogsTab = () => {
  // Pull context values
  const { project } = useProjectDetailPageIndexContext();

  // Query Logs
  const logsQuery = queryIndex.logs({ projectId: project?.id || "" });
  const { data: logsQueryResult, isPending: isLoadingLogs } = useQuery({
    ...logsQuery.queryOptions,
    enabled: !!project?.id,
  });
  const logs = logsQueryResult?.result?.result || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <header className="space-y-4">
          <h1 className="text-4xl flex items-center justify-between font-bold">
            <span>Logs</span>
          </h1>
          <p className="font-light text-sm">{`This is where you can review every activity on this project for the last 30 days`}</p>
        </header>
      </header>

      {/* Filter Bar */}
      <div
        className={`flex items-center overflow-x-scroll scrollbar-none gap-4 ${isLoadingLogs ? "pointer-events-none animate-pulse opacity-50" : ""}`}
      >
        <Button variant={"outline"} size={"sm"}>
          <UserRound /> Actor
        </Button>
        <Button variant={"outline"} size={"sm"}>
          <UserRound /> Target
        </Button>
        <Button variant={"outline"} size={"sm"}>
          <Logs /> Action
        </Button>
        <Button variant={"outline"} size={"sm"}>
          <Calendar /> Date
        </Button>
      </div>

      {/* Table */}
      {isLoadingLogs ? (
        <div className="flex-center min-h-48 flex gap-2 items-center animate-pulse">
          <Loader className="animate-spin" /> <span>Loading</span>
        </div>
      ) : !logs?.length ? (
        <div className="flex-center min-h-48 flex gap-2 items-center font-light opacity-50 text-sm">
          <Frown className="w-5 h-5" /> <span>No Recorded Activity Yet</span>
        </div>
      ) : (
        <div className="space-y-2">
          {logs?.map((log, index) => (
            <LogCard key={log?.id || `log-${index}`} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LogsTab;
