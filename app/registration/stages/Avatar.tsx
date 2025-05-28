import { UsersPersonalPatchRequest } from "@/app/api/users/personal/patch";
import { DEFAULT_AVATAR } from "@/src/lib/tusktask/constants/configs";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useRegistrationContext from "@/src/lib/tusktask/hooks/context/useRegistrationContext";
import mutatePersonalData from "@/src/lib/tusktask/mutators/mutatePersonalData";
import mutateUserData from "@/src/lib/tusktask/mutators/mutateUserData";
import { imageUrlToBase64 } from "@/src/lib/tusktask/utils/imageUrlToBase64";
import AvatarUploader from "@/src/ui/components/tusktask/prefabs/AvatarUploader";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Avatar = () => {
  // Pull session
  const { data: session } = useSession();

  // State image
  const [image, setImage] = useState<string>("");

  // Pull personal data
  const { personal, setCanContinue, setOnContinue, setStage } =
    useRegistrationContext();

  // Pull triggers from notification context
  const { triggerToast } = useNotificationContext();

  useEffect(() => {
    const convertImageToBase64 = async () => {
      if (personal && personal.image) {
        try {
          const base64 = await imageUrlToBase64(personal.image);
          setImage(base64);
        } catch (error) {
          triggerToast({
            type: "error",
            title: "Something Went Wrong",
            description:
              "Failed to render your original avatar, please upload a new one. We'll store it in our own server.",
          });
          const base64 = await imageUrlToBase64(DEFAULT_AVATAR);
          setImage(base64);
          console.error("Failed to convert image to base64:", error);
        }
      }
    };

    convertImageToBase64();
  }, [personal]);

  // Mutation
  const { mutate } = useMutation({
    mutationKey: ["personal", "update", "avatar"],
    mutationFn: mutatePersonalData,
    onMutate: () => {
      triggerToast({
        type: "default",
        title: "Saving Your Changes",
        description: "We're saving your changes on background",
      });
      setStage("preferences");
      setCanContinue(false);
      setOnContinue(() => {});
    },
    onError: () => {
      triggerToast({
        type: "error",
        title: "Failed To Save Changes",
        description: "Failed to save changes on background, please try again.",
      });
      setStage("avatar");
      setCanContinue(true);
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Changes Saved Successfully",
        description: "Your changes has been saved successfully",
      });
      registration({
        userId: session!.user.id!,
        newValue: {
          registration: "preferences",
        },
      });
    },
  });

  const { mutate: registration } = useMutation({
    mutationKey: ["personal", "update", "registration"],
    mutationFn: mutateUserData,
  });

  // HandleSubmit
  const handleSubmit = () => {
    const request: UsersPersonalPatchRequest = {
      operation: "avatar",
      avatar: image,
    };

    mutate(request);
  };

  // Listen to image changes
  useEffect(() => {
    if (image.length > 3) {
      setCanContinue(true);
      setOnContinue(() => handleSubmit);
    } else {
      setCanContinue(false);
    }
  }, [image, setOnContinue, setCanContinue]);

  return (
    <div>
      <header>
        <h1 className={`text-2xl font-bold`}>Avatar</h1>
        <p className={`text-sm text-muted-foreground`}>
          Keep it as it is or upload a fresh avatar—it's all about your style
          and your decision!
        </p>
      </header>
      <div className="mt-4">
        <AvatarUploader image={image} setImage={setImage} />
      </div>
    </div>
  );
};

export default Avatar;
