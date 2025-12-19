"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, FileType, FileUser, FunnelX } from "lucide-react";
import Link from "next/link";
import { queryIndex } from "@/src/lib/queries";
import { LogCard } from "@/src/ui/components/ui/LogCard";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const Controller = ({ id }: { id: string }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant={"outline"} size={"sm"} asChild>
          <Link href={`/dashboard/projects/${id}`}>
            <ChevronLeft className="w-4 h-4" />{" "}
          </Link>
        </Button>
        <Button variant={"outline"} size={"sm"} disabled>
          <FunnelX className="w-4 h-4" />{" "}
          <span className="font-light">Reset</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant={"outline"} size={"sm"}>
          <FileType className="w-4 h-4" />{" "}
          <span className="hidden md:flex font-light">Event Type</span>
        </Button>
        <Button variant={"outline"} size={"sm"}>
          <FileUser className="w-4 h-4" />
          <span className="hidden md:flex font-light">Member</span>
        </Button>
      </div>
    </div>
  );
};

const ProjectLogPageIndex = ({ id }: { id: string }) => {
  const logQuery = queryIndex.logs({ projectId: id });
  const { data: logQueryResult } = useQuery({
    ...logQuery.queryOptions,
  });
  const logs = logQueryResult?.result?.result;

  return (
    <div className="space-y-6">
      {/* Controller */}
      <Controller id={id} />

      {/* Logs */}
      <div>
        {Array.isArray(logs) &&
          logs.map((log, index) => (
            <LogCard key={log?.id || `log-${index}`} log={log} />
          ))}
      </div>
    </div>
  );
};

export default ProjectLogPageIndex;
