"use client";

import { UserType } from "@/src/db/schema/users";
import { userMutationErrorHandler } from "@/src/lib/tusktask/handlers/userMutationHandlers";
import useRegistrationFlowContext from "@/src/lib/tusktask/hooks/context/useRegistrationFlowContext";
import { mutateUserAvatar } from "@/src/lib/tusktask/mutators/mutateUserAvatar";
import { mutateUserData } from "@/src/lib/tusktask/mutators/mutateUserData";
import { triggerToast } from "@/src/lib/tusktask/utils/triggerToast";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Input } from "@/src/ui/components/shadcn/ui/input";
import AnimatedEntry from "@/src/ui/components/tusktask/animation/AnimatedEntry";
import { useMutation } from "@tanstack/react-query";
import { register } from "module";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const AvatarPhase = () => {
  // Next Phase
  const next: UserType["registration"] = "final";

  // Active
  const [active, setActive] = useState(true);

  // Pull session
  const { data: session, update } = useSession();

  // Pull setter
  const { loading, setLoading, setCanContinue, setOnContinue } =
    useRegistrationFlowContext();

  // InputRef
  const inputRef = useRef<HTMLInputElement | null>(null);

  // New Image
  const [newImage, setNewImage] = useState<string | ArrayBuffer | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const { mutate } = useMutation({
    mutationFn: mutateUserAvatar,
    onSuccess: async () => {
      triggerToast({
        type: "success",
        title: "Success",
        duration: 10000,
        description: "Thank you, we'll take you to the next step.",
      });
      setLoading(false);
      setTimeout(async () => {
        setActive(false);
        mutateUserData({
          userId: session!.user!.id!,
          trigger: "personal",
          newValue: {
            registration: next,
          },
        });
        await update({
          user: {
            registration: next,
          },
        });
      }, 1000);
    },
    onError: (data) => {
      userMutationErrorHandler({ data, setLoading });
    },
  });

  return (
    <AnimatedEntry
      origin="right"
      destination="left"
      speed={1}
      outSpeed={1}
      trigger={active}
    >
      <div className={`space-y-6 transition-all duration-700`}>
        <header>
          <h2 className="text-3xl font-primary font-bold">Show Your Style</h2>
          <p className="text-sm text-tt-primary-foreground/70">
            Keep your current avatar or upload a fresh one—your vibe, your
            choice!
          </p>
        </header>
        <Input
          type="file"
          className="hidden"
          ref={inputRef}
          accept="image/png, image/jpg, image/jpeg, image/webp"
          onChange={(e) => {
            handleFileChange(e);
          }}
        />
        <div className="space-y-4">
          <div className="flex justify-center">
            <Image
              width={180}
              height={180}
              src={
                (newImage as string) ??
                session?.user.image ??
                "/images/default.jpg"
              }
              alt="Preview Avatar"
              className="rounded-2xl w-[180px] h-[180px] object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {!newImage && (
              <Button
                onClick={async () => {
                  if (!session || !session.user.id) return;
                  setLoading(true);
                  await mutateUserData({
                    userId: session.user.id,
                    trigger: "personal",
                    newValue: {
                      registration: next,
                    },
                  });

                  update({
                    user: {
                      registration: next,
                    },
                  });
                }}
                variant={"outline"}
                disabled={loading}
              >
                {loading ? <>Loading</> : <>Keep</>}
              </Button>
            )}

            <Button
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.click();
                }
              }}
              variant={!newImage ? "default" : "outline"}
              disabled={loading}
            >
              {newImage ? "Choose Other" : "Upload New"}
            </Button>

            {newImage && (
              <Button
                onClick={() => {
                  setLoading(true);
                  mutate({ newAvatar: newImage as string });
                }}
                variant={"default"}
                disabled={loading}
              >
                Upload
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatedEntry>
  );
};

export default AvatarPhase;
