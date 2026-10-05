import { IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import route from "@/src/app/route";
import type { ProjectSelectType } from "@/src/db/schema/t-project";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
} from "../shadcn/components/ui/context-menu";
import { useSidebar } from "../shadcn/components/ui/sidebar";

const ProjectNavContextMenu = ({ data }: { data: ProjectSelectType }) => {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  return (
    <>
      {/* Project Context Menu */}
      <ContextMenuGroup>
        <ContextMenuLabel>{data.name}</ContextMenuLabel>
        <ContextMenuItem
          onClick={() => {
            router.push(route.project(data.id));
            setOpenMobile(false);
          }}
        >
          <IconArrowRight /> <span>Open</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <IconPlus /> <span>New Task</span>
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <IconTrash /> <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};
export default ProjectNavContextMenu;
