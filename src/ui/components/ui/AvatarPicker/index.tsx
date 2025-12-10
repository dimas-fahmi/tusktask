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
import { useNotificationStore } from "@/src/lib/stores/notification";
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
import { cn } from "@/src/ui/shadcn/lib/utils";
import ImageGalleryModal from "../ImageGalleryModal";
import PopoverItem from "../PopoverItem";

export type AvatarPickerClassNames = {
  container?: string;
  image?: string;
  changeButton?: string;
  popoverContent?: string;
};

export type AvatarPickerProps = {
  classNames?: AvatarPickerClassNames;
};

const AvatarPicker = ({ classNames }: AvatarPickerProps) => {
  const { data: profileResponse } = useGetSelfProfile();
  const profile = profileResponse?.result;
  const [ImageGalleryModalOpen, setImageGalleryModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | undefined>(
    undefined,
  );

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  const { triggerToast } = useNotificationStore();

  return (
    <div
      className={cn(
        "relative w-60 mx-auto my-2 aspect-square rounded-full shadow-2xl",
        classNames?.container,
      )}
    >
      <Image
        layout="fill"
        src={
          selectedImage?.url ??
          profile?.image ??
          "https://images.pexels.com/photos/2341350/pexels-photo-2341350.jpeg"
        }
        alt="Profile Picture"
        className={cn("rounded-full object-cover", classNames?.image)}
      />

      {/* Change Button */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "absolute bottom-3 right-3 z-10 bg-muted p-3 rounded-full shadow-2xl hover:scale-95 active:scale-90 transition-all border duration-300",
              classNames?.changeButton,
            )}
          >
            <ImagesIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "space-y-4 bg-background/95 px-6",
            classNames?.popoverContent,
          )}
        >
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
                    onError: () => {
                      triggerToast("Failed to Save Changes", {
                        description:
                          "Something went wrong, if the issue persist please contact developer",
                      });
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
