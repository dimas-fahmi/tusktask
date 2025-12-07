import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { ImageGalleryModalContext } from "./context";
import ImageGalleryModalDesktop from "./Desktop";
import ImageGalleryModalMobile from "./Mobile";

export interface ImageGalleryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ImageGalleryModal = ({ open, setOpen }: ImageGalleryModalProps) => {
  const isDesktop = useMediaQuery({
    query: "(min-width:768px)",
  });

  const [compactMode, setCompactMode] = useState(false);
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
      }}
    >
      {isDesktop ? <ImageGalleryModalDesktop /> : <ImageGalleryModalMobile />}
    </ImageGalleryModalContext.Provider>
  );
};

export default ImageGalleryModal;
