import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import Cropper from "react-easy-crop";
import { getCroppedImage } from "@/src/lib/tusktask/utils/getCropImage";
import { Camera, Crop, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/ui/avatar";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

interface AvatarUploaderProps {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ image, setImage }) => {
  // Pull triggers from NotificationContext
  const { triggerToast } = useNotificationContext();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setImageUrl(result);
          setOpen(true);
        };
        reader.readAsDataURL(file);

        e.target.value = "";
      } else {
        triggerToast({
          type: "error",
          title: "Invalid File Type",
          description: "Please select an image file.",
        });
      }
    }
  };

  const handleCrop = async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImage(imageUrl, croppedAreaPixels);
      if (croppedImage) {
        setImage(croppedImage);
        setOpen(false);
        setSelectedFile(null);
        setImageUrl(null);
        setCroppedAreaPixels(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      } else {
        throw new Error("Cropped image is undefined");
      }
    } catch (error) {
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "Failed to crop your image, please try again",
      });
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setImageUrl(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full border">
        {image ? (
          <Avatar className="w-32 h-32 rounded-full">
            <AvatarImage src={image} alt="Avatar Preview" />
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
        ) : (
          <div className="bg-muted w-32 h-32 rounded-full" />
        )}
        <Button
          className="absolute right-0 bottom-0 bg-background"
          variant="outline"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          <Camera />
        </Button>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-upload"
        ref={inputRef}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">Crop Image</DialogTitle>
          <DialogDescription className="sr-only">
            Crop Image dialog
          </DialogDescription>
          {imageUrl && (
            <div className="max-w-md w-full h-[280px]">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <div className="absolute bottom-2 right-2 rounded-md bg-muted px-4 py-2 flex gap-2 items-center justify-center opacity-30 hover:opacity-100 transition-all duration-300">
                <Button variant="ghost" onClick={handleCrop}>
                  <Crop />
                </Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  <X />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarUploader;
