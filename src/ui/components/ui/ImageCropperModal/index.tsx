import {
  type LucideIcon,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";
import { useState } from "react";
import Cropper from "react-easy-crop";
import { useImageUploadModalStore } from "@/src/lib/stores/imageUploadModal";
import { getCroppedImg } from "@/src/lib/utils/getCroppedImage";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";

const ORIENTATIONS = {
  square: {
    icon: Square,
    aspectRatio: 1 / 1,
    label: "Square",
  },
  wide: {
    icon: RectangleHorizontal,
    aspectRatio: 16 / 9,
    label: "Wide",
  },
  vertical: {
    icon: RectangleVertical,
    aspectRatio: 9 / 16,
    label: "Vertical",
  },
} as const;

const orientationKeys = Object.keys(
  ORIENTATIONS,
) as (keyof typeof ORIENTATIONS)[];

const AspectRatioButton = ({
  aspectRatio,
  setTo,
  setAspectRatio,
  icon,
  label,
  disabled,
}: {
  aspectRatio: number;
  setTo: number;
  setAspectRatio: React.Dispatch<React.SetStateAction<number>>;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}) => {
  const Icon = icon;

  return (
    <button
      type="button"
      className={`${
        aspectRatio === setTo
          ? "bg-muted text-muted-foreground"
          : "hover:bg-muted"
      } flex flex-col border-transparent text-xs font-light cursor-pointer transition-all duration-300 px-4 py-2 items-center justify-center rounded-xl disabled:opacity-50 hover:scale-95 active:scale-90`}
      onClick={() => setAspectRatio(setTo)}
      disabled={disabled}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

const ImageCropperModal = () => {
  const {
    croppingImage,
    setCroppingImage,
    crop,
    setCrop,
    zoom,
    setFile,
    setZoom,
    croppedAreaPixels,
    setCroppedAreaPixels,
    setCropperStatus,
    setBlob,
    cropperOpen,
    setPreview,
    setCropperOpen,
  } = useImageUploadModalStore();

  const [aspectRatio, setAspectRatio] = useState(1 / 1);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!croppingImage || !croppedAreaPixels) return;
    const { blob, file, url } = await getCroppedImg(
      croppingImage,
      croppedAreaPixels,
      setCropperStatus,
    );

    URL.revokeObjectURL(croppingImage);
    setCroppingImage(url);
    setFile(file);
    setBlob(blob);
    setPreview(url);
  };

  return (
    <Dialog open={cropperOpen} onOpenChange={setCropperOpen}>
      <DialogContent className="min-h-[560px] max-h-[560px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Store your image in TuskTask gallery
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-square group/box rounded-2xl flex-center overflow-hidden">
          {croppingImage && (
            <Cropper
              image={croppingImage}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
              aspect={aspectRatio}
            />
          )}
        </div>

        {/* Status Bar */}
        <div className="rounded-xl flex justify-center gap-2">
          {orientationKeys.map((item) => (
            <AspectRatioButton
              key={crypto.randomUUID()}
              {...{ aspectRatio, setAspectRatio }}
              icon={ORIENTATIONS[item].icon}
              setTo={ORIENTATIONS[item].aspectRatio}
              label={ORIENTATIONS[item].label}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={async () => {
              setLoading(true);
              await handleSave();
              setCropperOpen(false);
              setLoading(false);
            }}
            disabled={loading}
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button type="button" variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropperModal;
