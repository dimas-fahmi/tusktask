"use client";

import { DateTime } from "luxon";
import { useState } from "react";
import type { ExtendedProjectMembershipType } from "@/src/lib/app/app";
import { PROJECT_MEMBERSHIP_ROLE_PERMISSIONS } from "@/src/lib/app/projectRBAC";
import { authClient } from "@/src/lib/auth/client";
import { AvatarButton } from "@/src/ui/components/ui/AvatarButton";
import EditMembershipDialog from "@/src/ui/components/ui/EditMembershipDialog";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";
import { useProjectDetailPageIndexContext } from "../../ProjectDetailPageIndex";

const MemberRow = ({
  membership: m,
  disableManage,
}: {
  membership: ExtendedProjectMembershipType;
  disableManage?: boolean;
}) => {
  const [EMDOpen, setEMDOpen] = useState(false);

  return (
    <TableRow className="rounded-xl items-center px-6">
      {/* Avatar */}
      <TableCell>
        {m?.member ? <AvatarButton user={m?.member} /> : ""}
      </TableCell>

      {/* Name */}
      <TableCell>{m?.member?.name}</TableCell>

      {/* Username */}
      <TableCell>{m?.member?.username}</TableCell>

      {/* Role */}
      <TableCell className="capitalize">{m?.type}</TableCell>

      {/* Joined since */}
      <TableCell>
        {DateTime.fromJSDate(new Date(m?.createdAt)).toRelative()}
      </TableCell>

      {/* Manage */}
      <TableCell>
        <Button
          disabled={disableManage}
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            setEMDOpen(true);
          }}
        >
          Manage
        </Button>
      </TableCell>

      {/* Dialog */}
      <EditMembershipDialog
        open={EMDOpen}
        onOpenChange={setEMDOpen}
        membership={m}
      />
    </TableRow>
  );
};

const MembersTab = () => {
  // Pull session
  const { data: session } = authClient.useSession();

  // Pull values from context
  const { memberships, project } = useProjectDetailPageIndexContext();

  // Get current user membership
  const currentUserMembership = memberships.find(
    (m) => m.userId === session?.user?.id,
  );
  const currentUserPermissions = currentUserMembership
    ? PROJECT_MEMBERSHIP_ROLE_PERMISSIONS[currentUserMembership?.type]
    : undefined;
  const isUserSupreme = project
    ? project?.ownerId === session?.user?.id
    : false;

  const getDescription = () => {
    if (isUserSupreme) {
      return "Manage this project memberships, as a true owner you're given the highest priviliges among all members. You can promote members to administrator or even owner. You can transfer this true ownership to other members as well.";
    }

    if (currentUserMembership?.type === "owner") {
      return "Manage this project memberships, promote users to administrators. You are an owner of this project, you have one of the highest privileges in this project.";
    }

    if (currentUserMembership?.type === "admin") {
      return "Manage this project memberships, promote observers to users, suspend memberships or even delete user's membership.";
    }

    if (currentUserMembership?.type === "member") {
      return "This is memberships list of this project, you can see all 20 members of this project. You can request promotion to owner if you need more privileges.";
    }

    if (currentUserMembership?.type === "observer") {
      return "This is memberships lists of this project, as an observer you can't interact with its activity. If you wish to contribute or make changes, contact administrator.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl flex items-center justify-between font-bold">
          <span>Members</span>

          <Button>Invite</Button>
        </h1>
        <p className="font-light text-sm">{getDescription()}</p>
      </header>

      {/* Search */}
      <div>
        <Input inputProps={{ placeholder: "Search by Name" }} />
      </div>

      {/* Table Container */}
      <Table>
        {/* Body */}
        <TableBody>
          {memberships.map((m, index) => (
            <MemberRow
              key={m?.userId || `member-${index}`}
              membership={m}
              disableManage={
                !currentUserPermissions?.manageMembership ||
                session?.user?.id === m?.userId
              }
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTab;
