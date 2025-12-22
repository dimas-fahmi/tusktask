import {
  ChessPawn,
  Crown,
  Eye,
  type LucideIcon,
  type LucideProps,
  Shield,
  ShieldHalf,
} from "lucide-react";
import type { PROJECT_MEMBERSHIP_ROLES } from "@/src/lib/app/projectRBAC";
import type { ProjectMembershipRoleType } from "@/src/lib/zod/notification";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";

export const ROLE_ICON: Record<
  (typeof PROJECT_MEMBERSHIP_ROLES)[number] | "supreme",
  LucideIcon
> = {
  supreme: Crown,
  owner: ShieldHalf,
  admin: Shield,
  member: ChessPawn,
  observer: Eye,
};

export const ROLE_DESCRIPTION: Record<
  (typeof PROJECT_MEMBERSHIP_ROLES)[number] | "supreme",
  string
> = {
  supreme: `In projects with multiple owners, the "Supreme Leader" is the primary authority with the unique power to demote other owners.`,
  owner: `The highest standard role. Owners possess full control, including the authority to promote or demote Admins. Only the Supreme Leader holds greater privilege.`,
  admin: `The project's enforcer. Admins manage the user base, possessing the power to suspend or delete users and delegate tasks.`,
  member: `The project's workforce. Members execute tasks and follow the directives set by Administrators and Owners.`,
  observer: `A restricted role for observation only. Observers have read-only access and cannot interact with tasks or project data.`,
};

export type ProjectRoleTagProps = {
  role: ProjectMembershipRoleType;
  className?: string;
  isSupreme?: boolean;
  iconProps?: LucideProps;
};

const ProjectRoleTag = ({
  role,
  className,
  isSupreme,
  iconProps,
}: ProjectRoleTagProps) => {
  const Icon = isSupreme ? ROLE_ICON.supreme : ROLE_ICON[role];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("rounded-full", className)}>
          <Icon {...iconProps} />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-72">
        {isSupreme ? ROLE_DESCRIPTION.supreme : ROLE_DESCRIPTION[role]}
      </TooltipContent>
    </Tooltip>
  );
};

export default ProjectRoleTag;
