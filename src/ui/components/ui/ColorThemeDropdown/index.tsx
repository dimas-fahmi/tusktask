"use client";
import { ChevronDown } from "lucide-react";
import {
  APP_COLOR_THEMES,
  APP_COLOR_THEMES_SHORT_NAME,
} from "@/src/lib/app/color-themes";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { usePreferencesStore } from "@/src/lib/stores/preferencesStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";
import { cn } from "@/src/ui/shadcn/lib/utils";

export interface ColorThemeDropdownClassNames {
  triggerClassNames?: string;
  itemClassNames?: string;
}

export interface ColorThemeDropdownProps {
  classNames?: ColorThemeDropdownClassNames;
}

const ColorThemeDropdown = (props?: ColorThemeDropdownProps) => {
  const { setActiveColorScheme, activeColorScheme } = usePreferencesStore();

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "text-sm p-2 px-4 border rounded-xl flex gap-1 items-center",
            props?.classNames?.triggerClassNames,
          )}
          type="button"
          disabled={isUpdatingProfile}
        >
          {APP_COLOR_THEMES_SHORT_NAME[activeColorScheme ?? "default"]}{" "}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {APP_COLOR_THEMES.map((item) => (
          <DropdownMenuItem
            key={crypto.randomUUID()}
            onClick={() => {
              setActiveColorScheme(item);
              updateProfile({
                theme: item,
              });
            }}
            className={cn("", props?.classNames?.itemClassNames)}
          >
            {APP_COLOR_THEMES_SHORT_NAME[item]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorThemeDropdown;
