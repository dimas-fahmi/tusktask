import { BookImage, ImagesIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/shadcn/components/ui/popover";
import ImageGalleryModal from "../ImageGalleryModal";
import PopoverItem from "../PopoverItem";

const AvatarPicker = () => {
  const [ImageGalleryModalOpen, setImageGalleryModalOpen] = useState(false);

  return (
    <div className="relative w-60 mx-auto my-2 aspect-square rounded-full shadow-2xl">
      <Image
        layout="fill"
        src={
          "https://images.pexels.com/photos/2341350/pexels-photo-2341350.jpeg"
        }
        alt="Profile Picture"
        className="rounded-full w-60 object-cover"
      />

      {/* Change Button */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="absolute bottom-3 right-3 z-10 bg-muted p-3 rounded-full shadow-2xl hover:scale-95 active:scale-90 transition-all border duration-300"
          >
            <ImagesIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent className="space-y-4 bg-background/95 px-6">
          <PopoverItem
            icon={BookImage}
            title="Pick From Gallery"
            onClick={() => setImageGalleryModalOpen(true)}
          />
          <PopoverItem icon={Trash} title="Remove Image" variant={"negative"} />
        </PopoverContent>
      </Popover>

      <ImageGalleryModal
        open={ImageGalleryModalOpen}
        setOpen={setImageGalleryModalOpen}
      />
    </div>
  );
};

export default AvatarPicker;
