"use client";

import {
  IconDots,
  IconFolder,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { cn } from "cn";
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppError } from "@/src/app/error";
import { useErrorTranslation } from "@/src/hooks/useErrorTranslation";
import { etm } from "@/src/i18n/errorTranslation/init";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/shadcn/components/ui/avatar";
import { Button, type ButtonProps } from "@/src/ui/shadcn/components/ui/button";
import { handleImageInput } from "@/src/utils/clientOnly/handleImageInput";
import { Toaster } from "@/src/utils/clientOnly/triggerToast";
import IconProcessButton, {
  type IconProcessStatus,
} from "../../ui/IconProcessButton";

const OFFSET_EXPAND = 32 as const;

const transition = {
  duration: 0.8,
  damping: 10,
  stiffness: 80,
  type: "spring",
  opacity: {
    type: "tween",
  },
  scale: {
    type: "tween",
  },
} as const satisfies Transition;

const toolVariants = {
  expand: {
    opacity: 1,
    rotate: 0,
    x: OFFSET_EXPAND,
    transition,
  },

  shrink: {
    opacity: 0,
    rotate: -360,
    x: 0,
    transition,
  },
} as const satisfies Variants;

const expandShrinkVariants = {
  shrink: {
    x: 0,
    rotate: 0,
    transition,
  },

  expand: {
    x: OFFSET_EXPAND,
    rotate: 360,
    transition,
  },

  uploadMode: {
    x: 0,
    scale: 1,
    rotate: -360,
    transition,
  },
} as const satisfies Variants;

const uploadVariants = {
  hide: {
    x: OFFSET_EXPAND,
    scale: 0,
    opacity: 0,
    rotate: 380,
    transition,
  },

  uploadMode: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition,
  },

  uploadingMode: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 720,
    transition,
  },
} as const satisfies Variants;

export type AvatarPickerProps = {
  setIsPending?: (pending: boolean) => void;
};

type ToolVariant = keyof typeof toolVariants;
type ToolAnimate = ToolVariant | (() => ToolVariant);

const ToolButton = ({
  animate,
  ...props
}: ButtonProps & { animate?: ToolAnimate }) => {
  return (
    <motion.div
      variants={toolVariants}
      initial={"shrink"}
      animate={typeof animate === "function" ? animate() : animate}
      exit={"shrink"}
    >
      <Button variant={"outline"} size={"icon-sm"} {...props} />
    </motion.div>
  );
};

const AvatarPicker = (props: AvatarPickerProps) => {
  const [file, setFile] = useState<File | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const { translate } = useErrorTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const [status, setStatus] = useState<IconProcessStatus>("idle");

  const [isOnProgress, setIsOnProgress] = useState(false);

  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!file) {
      if (lastUrlRef.current) {
        URL.revokeObjectURL(lastUrlRef.current);
      }

      return;
    }

    const url = URL.createObjectURL(file);

    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
    }

    lastUrlRef.current = url;

    setPreviewURL(url);

    return () => {
      if (lastUrlRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  useEffect(() => {
    if (status === "idle") return;

    const timeout = setTimeout(() => {
      if (status === "pending") {
        return setStatus("error");
      }

      if (status === "success" || status === "error") {
        setStatus("idle");
        setIsOnProgress(false);
        setPreviewURL(null);
        setIsExpanded(false);
        return;
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div
      className={cn(
        "relative min-w-[120px] min-h-[120px] aspect-square",
        status === "pending" ? "animate-pulse" : "",
      )}
    >
      <input
        ref={inputRef}
        aria-hidden
        className="hidden"
        type="file"
        accept="image/jpeg, image/webp, image/png"
        onChange={async (e) => {
          try {
            await handleImageInput(e, "avatar", setFile);
          } catch (err) {
            const toast = new Toaster({
              id: "error-handle-image-input",
              title: translate(etm.generic.construct()),
              type: "error",
              trigger: false,
            });

            if (err instanceof AppError) {
              toast.update({ description: translate(err.message) });
            } else {
              toast.update({
                description: translate(etm.unknown_error.construct()),
              });
            }

            toast.trigger();
          }
        }}
      />

      {/* Preview */}
      <Avatar className={"w-full h-full rounded-full"}>
        {previewURL && <AvatarImage src={previewURL} />}
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>

      {/* Buttons */}
      <div className="absolute bottom-5 left-3 right-3 flex items-center justify-end gap-1">
        <AnimatePresence mode="sync">
          {/* Delete Button */}
          {isExpanded && !previewURL && (
            <ToolButton
              key={"tool-delete"}
              animate={"expand"}
              className={"text-destructive not-disabled:hover:text-destructive"}
              onClick={() => {
                setFile(null);
                setPreviewURL(null);
              }}
            >
              <IconTrash />
            </ToolButton>
          )}

          {/* Input Button */}
          {isExpanded && !previewURL && (
            <ToolButton
              key={"tool-input"}
              animate={"expand"}
              onClick={() => {
                inputRef?.current?.click();
              }}
            >
              <IconFolder />
            </ToolButton>
          )}

          {/* Expand & Shrink Button */}
          <motion.div
            key={"tool-expand-toggle"}
            variants={expandShrinkVariants}
            initial={"shrink"}
            animate={
              isExpanded ? (previewURL ? "uploadMode" : "expand") : "shrink"
            }
          >
            <Button
              variant={"outline"}
              disabled={isOnProgress}
              size={"icon-sm"}
              {...props}
              onClick={(e) => {
                if (e.defaultPrevented) return;

                if (previewURL) {
                  setPreviewURL(null);
                  return;
                }

                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <IconX /> : <IconDots />}
            </Button>
          </motion.div>

          {/* Expand & Shrink Button */}
          <motion.div
            key={"tool-upload"}
            variants={uploadVariants}
            initial={"shrink"}
            animate={isExpanded ? (previewURL ? "uploadMode" : "hide") : "hide"}
          >
            <IconProcessButton
              {...{ status, setStatus }}
              disabled={status === "pending"}
              idleIcon={IconUpload}
              onClick={() => {
                setIsOnProgress(true);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AvatarPicker;
