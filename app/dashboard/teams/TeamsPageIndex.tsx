"use client";

import React from "react";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import TeamCard from "@/src/ui/components/tusktask/prefabs/TeamCard";
import { CirclePlus, FolderGit2 } from "lucide-react";
import { Button } from "@/src/ui/components/shadcn/ui/button";

const TeamsPageIndex = () => {
  // Pull teamContext values
  const { teams, isFetchingTeams, setNewTeamDialogOpen } = useTeamContext();

  return (
    <div>
      <header className="mb-6">
        <h1 className="flex items-center justify-between">
          <span className="text-3xl font-bold flex items-center gap-2">
            <FolderGit2 className="w-7 h-7" />
            Your Teams
          </span>
          <span>
            <Button onClick={() => setNewTeamDialogOpen(true)}>
              <CirclePlus />
              New Team
            </Button>
          </span>
        </h1>
        <div className="hidden md:flex mt-3 items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1"></p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teams &&
          teams.length !== 0 &&
          teams.map((team) => (
            <TeamCard key={team?.id ?? crypto.randomUUID()} team={team} />
          ))}
      </div>
    </div>
  );
};

export default TeamsPageIndex;
