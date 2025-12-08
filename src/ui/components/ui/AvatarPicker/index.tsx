"use client";

import {
  BookImage,
  Check,
  ImagesIcon,
  SquircleDashed,
  Trash,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { ImageType } from "@/src/db/schema/image";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/shadcn/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import ImageGalleryModal from "../ImageGalleryModal";
import PopoverItem from "../PopoverItem";

const AvatarPicker = () => {
  const { data: profileResponse } = useGetSelfProfile();
  const profile = profileResponse?.result;
  const [ImageGalleryModalOpen, setImageGalleryModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | undefined>(
    undefined,
  );

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <div className="relative w-60 mx-auto my-2 aspect-square rounded-full shadow-2xl">
      <Image
        layout="fill"
        src={
          selectedImage?.url ??
          profile?.image ??
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
        compactMode={!!selectedImage}
        pickMode
        pickButton={
          <motion.div
            initial={{ width: 0 }}
            animate={selectedImage ? { width: "auto" } : { width: 0 }}
            className="overflow-hidden flex gap-2"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"sm"}
                  disabled={!selectedImage}
                  onClick={() => {
                    setSelectedImage(undefined);
                  }}
                  variant={"outline"}
                >
                  <SquircleDashed />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear selection</TooltipContent>
            </Tooltip>

            <Button
              size={"sm"}
              disabled={!selectedImage || isUpdatingProfile}
              onClick={() => {
                if (!selectedImage || isUpdatingProfile) return;
                updateProfile(
                  { image: selectedImage?.url },
                  {
                    onSuccess: () => {
                      setImageGalleryModalOpen(false);
                    },
                  },
                );
              }}
            >
              <Check />
              {isUpdatingProfile ? "Saving" : "Save"}
            </Button>
          </motion.div>
        }
        {...{ selectedImage, setSelectedImage }}
      />
    </div>
  );
};

export default AvatarPicker;
