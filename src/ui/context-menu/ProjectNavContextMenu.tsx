import { IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import route from "@/src/app/route";
import type { ProjectSelectType } from "@/src/db/schema/t-project";
import { useConfirmationDialog } from "@/src/hooks/useConfirmationDialog";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { stripLocaleFromPathname } from "@/src/i18n";
import { useTRPC } from "@/src/lib/trpc/client/client";
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

  const trpc = useTRPC();
  const { toast } = useHandleQueryError();
  const myProjectsQueryKey = trpc.project.get.queryKey({});

  const pathname = stripLocaleFromPathname(usePathname());
  const projectURL = route.project(data.id);

  const { mutate: deleteProject, isPending: isDeletingProject } = useMutation({
    ...trpc.project.delete.mutationOptions(),
    onError: (err) => {
      toast("failed_to_delete_project", err, true);
    },
    onSuccess: (_data, _var, _onMutateResult, ctx) => {
      ctx.client.invalidateQueries({
        queryKey: myProjectsQueryKey,
      });

      if (pathname === projectURL) {
        router.replace(route.myProjects());
      }
    },
  });

  const disabled = isDeletingProject;

  return (
    <>
      {/* Project Context Menu */}
      <ContextMenuGroup>
        <ContextMenuLabel>{data.name}</ContextMenuLabel>
        <ContextMenuItem
          onClick={() => {
            router.push(projectURL);
            setOpenMobile(false);
          }}
          disabled={disabled}
        >
          <IconArrowRight /> <span>{t("common.open")}</span>
        </ContextMenuItem>
        <ContextMenuItem disabled={disabled}>
          <IconPlus /> <span>{t("common.new_task")}</span>
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          disabled={data.isPrimary || disabled}
          onClick={() => {
            confirmationDialog({
              title: t("alert.project_deletion_confirmation.title"),
              desc: t("alert.project_deletion_confirmation.desc"),
              positiveButtonProps: {
                variant: "destructive",
                onClick() {
                  deleteProject({
                    id: data.id,
                  });
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
