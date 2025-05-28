import { db } from "@/src/db";
import { teams } from "@/src/db/schema/teams";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import React from "react";
import TeamPageIndex from "./TeamPageIndex";

const getTeam = async (id: string) => {
  if (!id) {
    return null;
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, id),
  });

  return team;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id } = await params;

  if (!id) {
    return {
      title: "Something Went Wrong | TuskTask",
    };
  }

  const team = await getTeam(id);

  return {
    title: `${team?.name ?? "Team Page"} | TuskTask`,
  };
};

const TeamPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <TeamPageIndex id={id} />;
};

export default TeamPage;
