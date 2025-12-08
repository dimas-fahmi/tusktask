import {
  APP_COLOR_THEMES,
  APP_COLOR_THEMES_METADATA,
} from "@/src/lib/app/color-themes";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useColorThemePickerModalStore } from "@/src/lib/stores/colorThemePickerModal";
import { usePreferencesStore } from "@/src/lib/stores/preferencesStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { ScrollArea } from "@/src/ui/shadcn/components/ui/scroll-area";
import ColorThemeCard from "./ColorThemeCard";

const ColorThemePickerModal = () => {
  const { open, setOpen: onOpenChange } = useColorThemePickerModalStore();
  const { activeColorScheme, setActiveColorScheme } = usePreferencesStore();

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Color Theme</DialogTitle>
          <DialogDescription>
            Customize your TuskTask color theme
          </DialogDescription>
        </DialogHeader>

        {/* Collection */}
        <ScrollArea className="min-h-92 max-h-92 w-full overflow-hidden pe-4">
          <div className="space-y-6 pb-4 overflow-hidden">
            {APP_COLOR_THEMES.map((theme) => (
              <ColorThemeCard
                key={crypto.randomUUID()}
                title={APP_COLOR_THEMES_METADATA[theme].title}
                description={APP_COLOR_THEMES_METADATA[theme].description}
                screenshot={APP_COLOR_THEMES_METADATA[theme].screenshot}
                active={theme === activeColorScheme}
                onClick={() => {
                  if (isUpdatingProfile || theme === activeColorScheme) return;
                  updateProfile({ theme });
                  setActiveColorScheme(theme);
                }}
                disabled={isUpdatingProfile || theme === activeColorScheme}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <footer>
          <DialogClose asChild>
            <Button className="w-full">Close</Button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default ColorThemePickerModal;
