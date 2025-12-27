"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { createContext, useContext } from "react";
import type { V1ProjectMembershipGetResponse } from "@/app/api/v1/project/membership/get";
import type {
  ExtendedProjectMembershipType,
  ExtendedProjectType,
} from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { type QueryObject, queryIndex } from "@/src/lib/queries";
import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import type { SanitizedUserType } from "@/src/lib/zod";
import NameAndDescription from "./components/NameAndDescription";
import NavigationBar from "./components/NavigationBar";
import LogsTab from "./components/tabs/Logs";
import MembersTab from "./components/tabs/Members";
import OverviewTab from "./components/tabs/Overview";
import SettingsTab from "./components/tabs/Settings";
import TasksTab from "./components/tabs/Tasks";

const TABS = {
  overview: <OverviewTab />,
  tasks: <TasksTab />,
  members: <MembersTab />,
  logs: <LogsTab />,
  settings: <SettingsTab />,
} as const;

export interface ProjectDetailPageIndexContextValues {
  project?: ExtendedProjectType;

  // Membership Query
  membershipsQuery?: QueryObject<V1ProjectMembershipGetResponse>;
  membershipsQueryResult?: V1ProjectMembershipGetResponse;

  // Extracted datas
  memberships: ExtendedProjectMembershipType[];
  members: SanitizedUserType[];
}

const ProjectDetailPageIndexContext =
  createContext<ProjectDetailPageIndexContextValues | null>(null);

export const useProjectDetailPageIndexContext = () => {
  const ctx = useContext(ProjectDetailPageIndexContext);

  if (!ctx) {
    throw new StandardError(
      "out_of_context",
      "ProjectDetailPageIndexContext can only be used inside it's provider",
    );
  }

  return ctx;
};

const ProjectDetailPageIndex = ({ id }: { id: string }) => {
  // Pull search params;
  const params = useSearchParams();

  // Query Project Information
  const { data: projectQuery } = useGetSelfProjects({ id });
  const project = projectQuery?.result?.result?.[0];

  // Query memberships
  const membershipsQuery = queryIndex.project.memberships({
    projectId: id,
    orderBy: "type",
    orderDirection: "desc",
  });
  const { data: membershipsQueryResult } = useQuery({
    ...membershipsQuery.queryOptions,
    enabled: !!id,
  });

  // Extract memberships query result
  const memberships = membershipsQueryResult?.result?.result || [];
  const members = memberships.flatMap((m) => (m?.member ? m.member : []));

  // Render Tab
  const tab = params.get("tab");
  const tabsKeys = Object.keys(TABS);
  const render =
    tab && tabsKeys.includes(tab) ? (
      TABS[tab as keyof typeof TABS]
    ) : (
      <OverviewTab />
    );

  return (
    <ProjectDetailPageIndexContext.Provider
      value={{
        project,
        members,
        memberships,
        membershipsQuery,
        membershipsQueryResult,
      }}
    >
      <div className="space-y-12">
        {/* Header */}
        <header className="space-y-6">
          {/* Name & Description */}
          <div className="min-h-42">
            <NameAndDescription project={project} />
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="border-b pb-4">
          <NavigationBar />
        </nav>

        {/* Tab To Render */}
        <div className="min-h-[480px]">{render}</div>
      </div>
    </ProjectDetailPageIndexContext.Provider>
  );
};

export default ProjectDetailPageIndex;
