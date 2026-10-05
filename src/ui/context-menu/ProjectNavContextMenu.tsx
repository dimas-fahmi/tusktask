import { IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import route from "@/src/app/route";
import type { ProjectSelectType } from "@/src/db/schema/t-project";
import { useConfirmationDialog } from "@/src/hooks/useConfirmationDialog";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
} from "../shadcn/components/ui/context-menu";
import { useSidebar } from "../shadcn/components/ui/sidebar";

const ProjectNavContextMenu = ({ data }: { data: ProjectSelectType }) => {
  const t = useTranslations();

  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  const confirmationDialog = useConfirmationDialog((s) => s.openDialog);

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
          <IconArrowRight /> <span>{t("common.open")}</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <IconPlus /> <span>{t("common.new_task")}</span>
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          disabled={data.isPrimary}
          onClick={() => {
            confirmationDialog({
              title: t("alert.project_deletion_confirmation.title"),
              desc: t("alert.project_deletion_confirmation.desc"),
              positiveButtonProps: {
                variant: "destructive",
                onClick() {
                  // TODO: DELETE TASK
                },
              },
              confirmationText: data.name,
            });
          }}
        >
          <IconTrash /> <span>{t("common.delete")}</span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};
export default ProjectNavContextMenu;
