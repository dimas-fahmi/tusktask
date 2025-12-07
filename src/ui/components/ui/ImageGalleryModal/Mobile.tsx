import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/src/ui/shadcn/components/ui/drawer";
import { useImageGalleryModalContext } from "./context";

const ImageGalleryModalMobile = () => {
  const { open, setOpen } = useImageGalleryModalContext();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="md:max-w-sm max-w-2xl!">
        <DrawerTitle>Image Gallery</DrawerTitle>
        <DrawerDescription>Your Image Collection</DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
};

export default ImageGalleryModalMobile;
