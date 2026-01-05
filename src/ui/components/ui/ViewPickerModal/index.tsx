import {
  useDashboardStore,
  VIEWS,
  VIEWS_METADATA,
} from "@/src/lib/stores/dashboard";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";

const ViewPickerModal = () => {
  const {
    viewPickerModalOpen: open,
    setViewPickerModalOpen: onOpenChange,
    activeView,
    setActiveView,
  } = useDashboardStore();

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Dashboard Layout</DialogTitle>
          <DialogDescription>
            Choose how your dashboard should look like
          </DialogDescription>
        </DialogHeader>

        {/* Dialog Content */}
        <div className="grid grid-cols-3 gap-3">
          {VIEWS.map((v) => {
            const Icon = VIEWS_METADATA[v].icon;
            return (
              <button
                type="button"
                key={v}
                className={`flex flex-col p-4 text-xs font-light items-center gap-2 border rounded-xl ${v === activeView ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => {
                  setActiveView(v);
                }}
              >
                {/* Icon */}
                <Icon className="w-5 h-5" />

                {/* Label */}
                <span>{VIEWS_METADATA[v].label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-1">
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPickerModal;
