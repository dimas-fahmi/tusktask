import { CircleAlert, Menu, Trash, Upload } from "lucide-react";
import { useImageUploadModalStore } from "@/src/lib/stores/imageUploadModal";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { ScrollArea } from "@/src/ui/shadcn/components/ui/scroll-area";
import Input from "../Input/input";
import { useImageGalleryModalContext } from "./context";
import ImageCard from "./ImageCard";

export const Header = () => {
  const { setOpen: setOpenUploadModal } = useImageUploadModalStore();

  return (
    <DialogHeader className="gap-4">
      <div className="space-y-1">
        <DialogTitle className="text-left">Image Gallery</DialogTitle>
        <DialogDescription className="text-left">
          Your Image Collection
        </DialogDescription>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div>
          <Input
            className="text-sm"
            inputProps={{ className: "py-1 px-2", placeholder: "Search Image" }}
          />
        </div>

        {/* Box-1 */}
        <div className="flex items-center gap-2">
          <Button size={"sm"} variant={"outline"} disabled>
            <Trash />
          </Button>

          <Button size={"sm"} variant={"outline"}>
            <Menu />
          </Button>

          <Button
            size={"sm"}
            onClick={() => {
              setOpenUploadModal(true);
            }}
          >
            <Upload />
            Upload
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};

const ImageGalleryModalDesktop = () => {
  const { open, setOpen, alert, setAlert } = useImageGalleryModalContext();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-sm max-w-2xl! max-h-[80vh] space-y-4 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Alert */}
        {alert && (
          <button
            type="button"
            className="text-sm flex gap-2 items-center px-4 py-2 bg-muted text-muted-foreground rounded-xl cursor-pointer"
            onClick={() => setAlert(null)}
          >
            <CircleAlert /> {alert}
          </button>
        )}

        {/* Content */}
        <ScrollArea className="max-h-62 pe-4">
          <div className="grid grid-cols-4 gap-4">
            <ImageCard />
            <ImageCard />
            <ImageCard />
            <ImageCard />
            <ImageCard />
            <ImageCard />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryModalDesktop;
