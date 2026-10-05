"use client";

import { cn } from "cn";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../../shadcn/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcn/components/ui/tooltip";
import IconRenderer from "../IconRenderer";
import { ICON_NAMES, type IconName } from "../IconRenderer/collections";

export type IconPickerProps = {
  defaultIcon?: IconName;
  onIconSelected?: (iconName: IconName) => void;
  selected?: IconName;
  setOpen?: (open: boolean) => void;
};

const IconPicker = ({
  defaultIcon,
  onIconSelected,
  setOpen,
}: IconPickerProps) => {
  const t = useTranslations();
  const [icon, setIcon] = useState<IconName>(defaultIcon ?? "beach");

  return (
    <div className="space-y-2">
      <header className="flex items-center gap-2">
        {/* Preview */}
        <div className="w-11 h-11 bg-muted text-muted-foreground flex items-center justify-center rounded-full">
          <IconRenderer iconName={icon} className="w-5 h-5" />
        </div>

        <div>
          <h1 className="text-xs uppercase font-light">
            {t("common.selected")}
          </h1>
          <p className="font-semibold">{t(`icon.${icon}`)}</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-2 min-h-48 max-h-48 overflow-hidden overflow-y-scroll custom-scrollbar pe-1">
        {ICON_NAMES.map((key) => (
          <Tooltip key={key}>
            <TooltipTrigger
              render={(props) => (
                <button
                  type="button"
                  {...props}
                  className={cn(
                    "flex flex-col items-center justify-center text-xs p-2 border rounded-md transition-all duration-250",
                    icon === key
                      ? "bg-primary text-primary-foreground"
                      : "not-disabled:hover:bg-foreground/10",
                  )}
                  onClick={() => {
                    setIcon(key);
                  }}
                >
                  <IconRenderer
                    iconName={key}
                    className="w-5 h-5"
                    stroke={1.5}
                  />
                </button>
              )}
            />

            <TooltipContent>{t(`icon.${key}`)}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <footer className="grid grid-cols-2 gap-2 border-t pt-2">
        <Button
          variant={"outline"}
          onClick={() => {
            setOpen?.(false);
          }}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={() => {
            onIconSelected?.(icon);
            setOpen?.(false);
          }}
        >
          {t("common.save")}
        </Button>
      </footer>
    </div>
  );
};
export default IconPicker;
