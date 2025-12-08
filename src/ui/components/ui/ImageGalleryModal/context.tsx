import { createContext, useContext } from "react";
import type { ImageType } from "@/src/db/schema/image";
import { StandardError } from "@/src/lib/app/errors";

export interface ImageGalleryModalContextValues {
  open: boolean;
  setOpen: (open: boolean) => void;

  compactMode: boolean;
  setCompactMode?: (compactMode: boolean) => void;

  alert: string | null;
  setAlert: (alert: string | null) => void;

  pickMode?: boolean;
  pickButton?: React.ReactNode;

  selectedImage?: ImageType;
  setSelectedImage?: (selectedImage?: ImageType | undefined) => void;
}

export const ImageGalleryModalContext =
  createContext<ImageGalleryModalContextValues | null>(null);

export const useImageGalleryModalContext = () => {
  const context = useContext(ImageGalleryModalContext);

  if (!context) {
    throw new StandardError(
      "out_of_context",
      "Image gallery modal context is out of reach, usage is only possible within the provider.",
    );
  }

  return context;
};
