"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { VIEW_LAYOUTS_ENTRIES } from "@/src/app/data/viewLayout";
import { useErrorTranslation } from "@/src/hooks/useErrorTranslation";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useNewProject } from "@/src/hooks/useNewProject";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { useTRPC } from "@/src/lib/trpc/client/client";
import IconRenderer from "../../components/IconRenderer";
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
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const Body = () => {
  const t = useTranslations();

  const { translate } = useErrorTranslation();

  const [setOpen] = useNewProject(useShallow((s) => [s.setOpen]));

  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(etzs.createProjectInput()),
    defaultValues: {
      name: "",
      description: "",
      iconId: "folder",
      viewLayout: "list",
    },
  });

  const icon = watch("iconId");
  const layout = watch("viewLayout");

  const trpc = useTRPC();
  const queryKey = trpc.project.get.queryKey({});

  const { toast } = useHandleQueryError();

  const { mutate, isPending } = useMutation({
    ...trpc.project.create.mutationOptions(),
    onError: (err) => {
      toast("error-failed-creating-project", err);
    },
    onSuccess: (_data, _variable, _onMutateResult, ctx) => {
      ctx.client.invalidateQueries({
        queryKey,
      });
      setOpen(false);
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => {
        mutate({
          ...data,
        });
      })}
    >
      <div className="space-y-6">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: state }) => (
            <MainInput
              label="Name"
              {...field}
              isInvalid={!!state?.error?.message}
              message={
                state?.error?.message
                  ? translate(state?.error?.message)
                  : undefined
              }
              autoComplete="off"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, ...field }, fieldState: state }) => (
            <MainInput
              label="Description"
              textArea
              className="max-h-24 no-scrollbar"
              {...field}
              value={value ?? ""}
              isInvalid={!!state?.error?.message}
              message={
                state?.error?.message
                  ? translate(state?.error?.message)
                  : undefined
              }
              autoComplete="off"
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
              <h2 className="font-semibold">Project Icon</h2>
              <p className="text-xs opacity-70">
                Customize your project's icon
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
                  defaultIcon="folder"
                  setOpen={setIconPickerOpen}
                  onIconSelected={(selected) => {
                    setValue("iconId", selected);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h2>Project Layout</h2>
          </div>
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
                  setValue("viewLayout", key);
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

      <footer className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={"outline"}
          onClick={() => {
            setOpen(false);
          }}
          disabled={isPending}
        >
          Close
        </Button>
        <Button type="submit" disabled={!isValid || isPending}>
          Save
        </Button>
      </footer>
    </form>
  );
};

const NewProjectDialog = () => {
  const isMobile = useIsMobile();

  const [open, setOpen] = useNewProject(useShallow((s) => [s.open, s.setOpen]));

  const title = "New Project";
  const desc = "Creating new project";

  const onOpenChange = (open: boolean) => {
    // RESET FORM
    setOpen(open);
  };

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />
      </DialogContent>
    </Dialog>
  );
};
export default NewProjectDialog;
