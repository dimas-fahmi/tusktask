"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import {
  VIEW_LAYOUTS_ENTRIES,
  type ViewLayout,
} from "@/src/app/data/viewLayout";
import { useErrorTranslation } from "@/src/hooks/useErrorTranslation";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useProjectSettings } from "@/src/hooks/useProjectSettings";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { useTRPC } from "@/src/lib/trpc/client/client";
import { Toaster } from "@/src/utils/clientOnly/triggerToast";
import IconRenderer from "../../components/IconRenderer";
import type { IconName } from "../../components/IconRenderer/collections";
import IconPicker from "../../components/ui/IconPicker";
import MainInput from "../../components/ui/MainInput";
import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcn/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/components/ui/popover";
import { Separator } from "../../shadcn/components/ui/separator";
import { Skeleton } from "../../shadcn/components/ui/skeleton";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const Body = () => {
  const t = useTranslations();

  const [setOpen, projectId] = useProjectSettings(
    useShallow((s) => [s.setOpen, s.projectId]),
  );

  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const trpc = useTRPC();
  const { data, isPending: _isPending } = useQuery({
    ...trpc.project.getProjectDetail.queryOptions({
      id: projectId ?? "",
    }),
    enabled: !!projectId,
  });

  const { translate } = useErrorTranslation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
    setValues,
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(
      etzs.updateProjectInput().omit({
        id: true,
      }),
    ),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      iconId: (data?.iconId as IconName) ?? "folder",
      viewLayout: (data?.viewLayout as ViewLayout) ?? "list",
    },
  });

  useEffect(() => {
    if (!data) return;

    setValues({
      name: data?.name,
      description: data?.description ?? "",
      iconId: (data?.iconId as IconName) ?? "folder",
      viewLayout: (data?.viewLayout as ViewLayout) ?? "list",
    });
  }, [data, setValues]);

  useEffect(() => {
    return () => {
      reset({
        description: "",
        iconId: "beach",
        name: "",
        viewLayout: "list",
      });
    };
  }, [reset]);

  const name = watch("name") || null;
  const desc = watch("description") || null;
  const layout = watch("viewLayout") || null;
  const icon = watch("iconId") || null;

  const isSame =
    data?.name === name &&
    desc === data?.description &&
    layout === data?.viewLayout &&
    icon === data?.iconId;

  const { toast } = useHandleQueryError();

  const { mutate: update, isPending: isUpdating } = useMutation({
    ...trpc.project.updateProject.mutationOptions(),
    onError: (err) => {
      toast(`error-updating-project-${projectId}`, err, true);
    },
    onSuccess: (_data, _var, _onMutateResult, ctx) => {
      if (projectId) {
        ctx.client.invalidateQueries({
          queryKey: trpc.project.getProjectDetail.queryKey({ id: projectId }),
        });

        ctx.client.invalidateQueries({
          queryKey: trpc.project.get.queryKey(),
        });
      }

      reset({
        iconId: "folder",
        description: "",
        name: "",
        viewLayout: "list",
      });

      new Toaster({
        id: `update-success-${projectId}`,
        title: t("common.changes_saved"),
        type: "success",
        trigger: true,
      });

      setOpen(false);
    },
  });

  const isPending = !projectId || _isPending || isUpdating;
  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => {
        if (isSame || !projectId) return;

        update({
          id: projectId,
          ...data,
        });
      })}
    >
      <div className="space-y-4">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: state }) => (
            <MainInput
              label={t("common.name")}
              {...field}
              isInvalid={!!state?.error?.message}
              message={
                state?.error?.message
                  ? translate(state?.error?.message)
                  : undefined
              }
              disabled={isPending}
              autoComplete="off"
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { value, ...field }, fieldState: state }) => (
            <MainInput
              label={t("common.description")}
              {...field}
              isInvalid={!!state?.error?.message}
              message={
                state?.error?.message
                  ? translate(state?.error?.message)
                  : undefined
              }
              disabled={isPending}
              value={value ?? ""}
              textArea
              autoComplete="off"
              className="max-h-28 no-scrollbar"
            />
          )}
        />

        <div className="flex items-center gap-3">
          {/* Preview */}
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <IconRenderer iconName={icon} className="w-5 h-5" stroke={1} />
          </div>

          <div className="flex-1 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{t("common.project_icon")}</h2>
              <p className="text-xs opacity-70">
                {t("common.customize_project_icon")}
              </p>
            </div>

            <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
              <PopoverTrigger
                render={(props) => (
                  <Button
                    {...props}
                    variant={"ghost"}
                    size={"icon-sm"}
                    disabled={isPending}
                  >
                    <IconPencil />
                  </Button>
                )}
              />

              <PopoverContent className={"min-w-78"}>
                <IconPicker
                  defaultIcon={icon ?? "folder"}
                  setOpen={setIconPickerOpen}
                  onIconSelected={(selected) => {
                    setValue("iconId", selected, {
                      shouldValidate: true,
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {VIEW_LAYOUTS_ENTRIES.map(([key, { icon: Icon }]) => (
              <button
                type="button"
                key={key}
                className={cn(
                  "flex flex-col items-center justify-center p-2 border rounded-md transition-all duration-300 text-xs",
                  layout === key
                    ? "bg-primary text-primary-foreground"
                    : "not-disabled:hover:bg-foreground/10",
                )}
                onClick={() => {
                  setValue("viewLayout", key, {
                    shouldValidate: true,
                  });
                }}
                disabled={isPending}
              >
                <Icon className="w-4 h-4" />
                <span>{t(`common.view_layouts.${key}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <footer className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={"outline"}
          onClick={() => {
            setOpen(false);
          }}
          disabled={isPending}
        >
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isPending || !isValid || isSame}>
          {t("common.save")}
        </Button>
      </footer>
    </form>
  );
};

const ProjectSettingsDialog = () => {
  const t = useTranslations();
  const isMobile = useIsMobile();

  const [projectId, setProjectId, open, _onOpenChange] = useProjectSettings(
    useShallow((s) => [s.projectId, s.setProjectId, s.open, s.setOpen]),
  );

  const onOpenChange = (open: boolean) => {
    _onOpenChange(open);
    if (!open) {
      const timeout = setTimeout(() => {
        setProjectId(null);
      }, 500);

      return () => clearTimeout(timeout);
    }
  };

  const trpc = useTRPC();
  const { data, isPending: _isPendingQuery } = useQuery({
    ...trpc.project.getProjectDetail.queryOptions({
      id: projectId ?? "",
    }),
    enabled: !!projectId,
  });

  const title = `${data?.name}`;
  const desc = t("common.customize_project_configurations");

  const isPending = _isPendingQuery || !projectId;

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          {isPending ? (
            <Skeleton className="h-4 w-48 mx-auto" />
          ) : (
            <DrawerTitle>{title}</DrawerTitle>
          )}
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>
        <Body />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          {isPending ? (
            <Skeleton className="h-4 w-48 mx-auto" />
          ) : (
            <DialogTitle>{title}</DialogTitle>
          )}
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Body />
      </DialogContent>
    </Dialog>
  );
};
export default ProjectSettingsDialog;
