import type React from "react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import type { ImageType } from "@/src/db/schema/image";
import { ImageGalleryModalContext } from "./context";
import ImageGalleryModalDesktop from "./Desktop";
import ImageGalleryModalMobile from "./Mobile";

export interface ImageGalleryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  pickMode?: boolean;
  pickButton?: React.ReactNode;

  selectedImage?: ImageType;
  setSelectedImage?: (selectedImage?: ImageType | undefined) => void;

  compactMode?: boolean;
  setCompactMode?: (compactMode: boolean) => void;
}

const ImageGalleryModal = ({
  open,
  setOpen,
  pickMode,
  pickButton,
  selectedImage,
  setSelectedImage,
  compactMode = false,
  setCompactMode,
}: ImageGalleryModalProps) => {
  const isDesktop = useMediaQuery({
    query: "(min-width:768px)",
  });

  const [alert, setAlert] = useState<string | null>(null);

  return (
    <ImageGalleryModalContext.Provider
      value={{
        open,
        setOpen,

        compactMode,
        setCompactMode,

        alert,
        setAlert,

        pickMode,
        pickButton,

        selectedImage,
        setSelectedImage,
      }}
    >
      {isDesktop ? <ImageGalleryModalDesktop /> : <ImageGalleryModalMobile />}
    </ImageGalleryModalContext.Provider>
  );
};

export default ImageGalleryModal;
