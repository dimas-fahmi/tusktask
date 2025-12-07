"use client";

import imageCompression from "browser-image-compression";
import { CircleAlert, HardDriveUpload, TrashIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ALLOWED_IMAGE_MAX_MIME_SIZE,
  ALLOWED_IMAGE_MIME_TYPES,
} from "@/src/lib/app/configs";
import { useImageUploadModalStore } from "@/src/lib/stores/imageUploadModal";
import { formatBytes } from "@/src/lib/utils/formatByte";
import { getFileMetadata } from "@/src/lib/utils/getFileMetadata";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import ImageCropperModal from "../ImageCropperModal";

type ErrorType = {
  title: string;
  description: string;
};

const ImageUploadModal = () => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const {
    open,
    setOpen,
    file,
    setFile,
    preview,
    setCropperOpen,
    setCroppingImage,
    compressedFile,
    setCompressedFile,
    reset,
    setPreview,
  } = useImageUploadModalStore();

  const [error, setError] = useState<ErrorType | null>(null);
  const [compressing, setCompressing] = useState(false);

  useEffect(() => {
    if (!open) {
      reset();
      setError(null);
    }
  }, [open, reset]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    e.target.value = ""; // Reset input for re-selection

    if (!selectedFile) return;

    // Validate MIME type
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(selectedFile.type)) {
      setError({
        title: "Invalid File Type",
        description: "Only images allowed: JPG, PNG, WEBP",
      });
      return;
    }

    // Validate size
    if (selectedFile.size > ALLOWED_IMAGE_MAX_MIME_SIZE) {
      setError({
        title: "Over Size Limit",
        description: "File is over size limit, can't be more than 5MB",
      });
      return;
    }

    setError(null);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setCroppingImage(url);
    setCropperOpen(true);
  };

  const handleOptimize = async () => {
    if (!file || !preview || compressedFile || compressing) return;

    setCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.1,
        fileType: "image/webp",
      });
      setCompressedFile(compressed);

      URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(compressed);
      setPreview(url);
    } catch (_err) {
      setError({
        title: "Compression Error",
        description: "Failed to optimize the image. Please try again.",
      });
    } finally {
      setCompressing(false);
    }
  };

  const fileMetadata = file ? getFileMetadata(file) : null;
  const compressedMetadata = compressedFile
    ? getFileMetadata(compressedFile)
    : null;

  const hasFileToOptimize =
    !!file && !!preview && !compressedFile && !compressing;

  const isFileNeedOptimization =
    !!file &&
    !!preview &&
    fileMetadata &&
    fileMetadata?.size > 99000 &&
    !compressedFile &&
    !compressing;

  const statusMessage = () => {
    if (!file || !preview) return "No File Selected";
    if (isFileNeedOptimization) {
      return `Size: ${formatBytes(fileMetadata?.size ?? 0, 0)}, needs further optimization (<100kb).`;
    }
    if (preview && !compressedFile && !compressing) {
      return `Cropped, size: ${formatBytes(fileMetadata?.size ?? 0)}`;
    }
    if (compressing) return "Optimizing image";
    if (compressedFile) {
      return `Compressed, ${formatBytes(fileMetadata?.size ?? 0)} -> ${formatBytes(compressedMetadata?.size ?? 0)}. Ready.`;
    }
    return "";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-h-[560px] max-h-[560px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Store your image in TuskTask gallery
            </DialogDescription>
          </DialogHeader>

          {error && (
            <button
              type="button"
              className="bg-destructive/15 text-destructive aspect-square group/box border-2 rounded-2xl flex items-center justify-center"
              onClick={() => {
                setError(null);
                hiddenInputRef.current?.click();
              }}
            >
              <div className="flex flex-col items-center opacity-70 group-hover/box:opacity-100 transition-all duration-300">
                <CircleAlert />
                <span className="text-sm block mt-3">{error?.title}</span>
                <span className="text-xs mt-6 block">{error?.description}</span>
              </div>
            </button>
          )}

          {!preview && !error && (
            <button
              type="button"
              className="aspect-square group/box border-dashed border-2 rounded-2xl flex items-center justify-center"
              onClick={() => hiddenInputRef.current?.click()}
            >
              <div className="flex flex-col items-center opacity-70 group-hover/box:opacity-100 transition-all duration-300">
                <HardDriveUpload />
                <span className="text-sm block mt-3">
                  Drag & Drop your image or browse
                </span>
                <span className="text-xs mt-6 block">jpg, png, webp</span>
              </div>
            </button>
          )}

          {preview && (
            <div className="relative aspect-square border bg-muted rounded-2xl overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />

              {/* Clear */}
              <button
                type="button"
                className="absolute top-3 right-3 border p-2 bg-background text-foreground rounded-full hover:scale-95 active:scale-90 transition-all duration-300"
                onClick={() => {
                  reset();
                }}
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative bg-muted py-2 px-4 rounded-xl overflow-hidden">
                <p className="z-10 text-center pt-1 font-light text-xs">
                  {statusMessage()}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <div className="mb-6">{`Given that TuskTask is operating under a freemium/hobby plan, it requires significant optimization. I'll compressed the image until it's less than 100kb, the bigger the size the longer it'll take. I apologize for the inconvenience.`}</div>

              <div className="mb-3">{`Dimas Fahmi`}</div>
            </TooltipContent>
          </Tooltip>

          <div className="flex gap-2">
            {hasFileToOptimize && isFileNeedOptimization && (
              <Button
                className={
                  !hasFileToOptimize && !isFileNeedOptimization
                    ? "max-w-0 p-0 overflow-hidden"
                    : "flex-1"
                }
                disabled={compressing || !isFileNeedOptimization}
                onClick={handleOptimize}
              >
                {compressing ? "Optimizing" : "Optimize"}
              </Button>
            )}

            <Button
              className={
                hasFileToOptimize && isFileNeedOptimization
                  ? "max-w-0 p-0 overflow-hidden"
                  : "flex-1"
              }
              disabled={
                !file ||
                ((fileMetadata?.size ?? 0) > 100000 &&
                  (compressedMetadata?.size ?? 0) > 100000) ||
                compressing
              }
            >
              Save
            </Button>

            <DialogClose asChild>
              <Button className="flex-1" type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </div>

          <input
            ref={hiddenInputRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.webp"
            onChange={handleFileChange}
          />
        </DialogContent>
      </Dialog>
      <ImageCropperModal />
    </>
  );
};

export default ImageUploadModal;
