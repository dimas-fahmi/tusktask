"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExtendedProjectType } from "@/src/lib/app/app";
import { queryIndex } from "@/src/lib/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const StatisticsTable = ({ project }: { project?: ExtendedProjectType }) => {
  const memberships = project?.memberships;

  const tasksQuery = queryIndex.self.tasks({
    projectId: project?.id,
  });
  const { data: tasksQueryResult } = useQuery({
    ...tasksQuery.queryOptions,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    enabled: !!project,
  });

  return (
    <div>
      <Table className="text-sm font-light">
        <TableBody>
          {/* Members Count */}
          <TableRow>
            <TableCell>Members</TableCell>
            <TableCell>{memberships?.length || "Unknown"}</TableCell>
          </TableRow>

          {/* Total Tasks Count */}
          <TableRow>
            <TableCell>Tasks Created</TableCell>
            <TableCell>
              {tasksQueryResult?.result?.totalResults || "Unknown"}
            </TableCell>
          </TableRow>

          {/* Active Tasks Count */}
          <TableRow>
            <TableCell>Active Tasks</TableCell>
            <TableCell>{0}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default StatisticsTable;
