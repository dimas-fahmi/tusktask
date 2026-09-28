"use client";

import {
  IconCircle,
  IconHelp,
  IconInfoCircle,
  IconLoader,
  IconMinus,
  IconPlus,
  IconRectangle,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useShallow } from "zustand/react/shallow";
import { AppError } from "@/src/app/error";
import IMG_CONFIG, { ASPECT_RATIO_ENTRIES } from "@/src/app/image/config";
import { useErrorTranslation } from "@/src/hooks/useErrorTranslation";
import { useImageCropper } from "@/src/hooks/useImageCropperDialog";
import { etm } from "@/src/i18n/errorTranslation/init";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/src/ui/shadcn/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/ui/shadcn/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";
import { useIsMobile } from "@/src/ui/shadcn/hooks/use-mobile";
import { compressImage } from "@/src/utils/clientOnly/browserImageCompression";
import { Toaster } from "@/src/utils/clientOnly/triggerToast";
import { formatBytes } from "@/src/utils/formatBytes";

const Body = () => {
  const [arIndex, setArIndex] = useState(0);

  const [
    aspect,
    compressedFile,
    crop,
    onCropChange,
    zoom,
    onZoomChange,
    previewUrl,
    progress,
    count,
    data,
    shape,
  ] = useImageCropper(
    useShallow((s) => [
      s.aspectRatio,
      s.compressedFile,
      s.crop,
      s.onCropChange,
      s.zoom,
      s.onZoomChange,
      s.previewUrl,
      s.compressionProgress,
      s.compressCount,
      s.data,
      s.shape,
    ]),
  );

  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("VALENTINE", compressedFile);
    const revokeUrl = () => {
      if (lastUrlRef.current) {
        URL.revokeObjectURL(lastUrlRef.current);
      }
    };

    if (!compressedFile) {
      console.log("DEADEND");
      revokeUrl();
      return;
    }

    const url = URL.createObjectURL(compressedFile);

    revokeUrl();

    lastUrlRef.current = url;

    useImageCropper.setState({
      previewUrl: url,
    });

    return () => {
      revokeUrl();
    };
  }, [compressedFile]);

  useEffect(() => {
    const [_, value] = ASPECT_RATIO_ENTRIES[arIndex];
    useImageCropper.setState({
      aspectRatio: value.value,
    });
  }, [arIndex]);

  const [_, arData] = ASPECT_RATIO_ENTRIES[arIndex];

  return (
    <div className="space-y-4">
      {/* Cropper Container */}
      <div className="relative w-full aspect-square max-h-[65vh] haltone rounded-xl overflow-hidden border">
        {/* Cropper */}
        {previewUrl && (
          <Cropper
            {...{
              image: previewUrl,
              crop,
              onCropChange,
              zoom,
              onZoomChange,
              aspect,
              cropShape: shape,
            }}
          />
        )}

        {/* Controller */}
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
          {/* Aspect Ratio Cycle */}
          <div className="flex items-center gap-1">
            <Button
              variant={"outline"}
              size={"xs"}
              onClick={() => {
                setArIndex(
                  arIndex === ASPECT_RATIO_ENTRIES.length - 1 ? 0 : arIndex + 1,
                );

                useImageCropper.setState({
                  shape: "rect",
                });
              }}
            >
              <arData.icon {...arData.props} />

              <span>{arData.label}</span>
            </Button>

            <Button
              disabled={aspect !== 1 / 1}
              variant={"outline"}
              size={"xs"}
              onClick={() => {
                useImageCropper.setState({
                  shape: shape === "rect" ? "round" : "rect",
                });
              }}
            >
              {shape === "rect" ? <IconRectangle /> : <IconCircle />}
              <span>{shape === "rect" ? "Rectangle" : "Round"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={"outline"}
              disabled={zoom === 1}
              size={"icon-xs"}
              onClick={() => {
                onZoomChange(zoom === 1 ? 1 : zoom - 0.25);
              }}
            >
              <IconMinus />
            </Button>
            <Button
              variant={"outline"}
              size={"icon-xs"}
              onClick={() => {
                onZoomChange(zoom + 0.25);
              }}
            >
              <IconPlus />
            </Button>
          </div>
        </div>

        {/* Statuses */}
        <div className="absolute top-5 right-5 left-5 flex items-center gap-1">
          {progress < 100 && (
            <Button variant={"outline"} size={"xs"}>
              <IconLoader /> <span>Compressing {progress}%</span>
            </Button>
          )}

          {progress === 100 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={(props) => (
                  <Button {...props} variant={"outline"} size={"xs"}>
                    <IconInfoCircle /> <span>Information</span>
                  </Button>
                )}
              />

              <DropdownMenuContent className={"w-fit p-0"}>
                <Table className="text-xs font-light">
                  <TableBody>
                    {/* Original Size */}
                    {data && (
                      <TableRow>
                        <TableCell>Original Size</TableCell>
                        <TableCell>{formatBytes(data.file.size)}</TableCell>
                      </TableRow>
                    )}

                    {compressedFile && (
                      <TableRow>
                        <TableCell>Compressed Size</TableCell>
                        <TableCell>
                          {formatBytes(compressedFile.size)}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <TableCell>Compression</TableCell>
                      <TableCell>{count}x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button
                  {...props}
                  className={"ms-auto"}
                  variant={"outline"}
                  size={"icon-xs"}
                >
                  <IconHelp />
                </Button>
              )}
            />

            <DropdownMenuContent className={"min-w-64"}>
              <div className="p-2">
                <p className="text-xs font-light">
                  As of right now, TuskTask is running on a free server with
                  limited bandwidth. We have to save as much bandwidth and
                  storage as we can, that is the reason why your image might
                  lose its quality.
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [reset] = useImageCropper(useShallow((s) => [s.reset]));

  return (
    <footer className="grid grid-cols-2 gap-1">
      <Button
        variant={"outline"}
        onClick={() => {
          reset();
        }}
      >
        Close
      </Button>
      <Button>Crop</Button>
    </footer>
  );
};

const ImageCropperDialog = () => {
  const isMobile = useIsMobile();

  const { translate } = useErrorTranslation();

  const [data, reset, compressedFile] = useImageCropper(
    useShallow((s) => [s.data, s.reset, s.compressedFile]),
  );

  const open = !!data;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      return reset();
    }
  };

  useEffect(() => {
    if (!data || compressedFile) return;

    console.log("MONA_LISA");

    const compress = async () => {
      try {
        console.log("DAVINCI");
        const config = IMG_CONFIG.category[data.config];
        let targetFile = data.file;
        let count: number = 0;

        console.log(
          targetFile.size,
          config.raw_size,
          targetFile.size > config.final_size,
        );

        while (targetFile.size > config.final_size) {
          count++;
          console.log(count, targetFile);
          targetFile = await compressImage(targetFile, {
            maxSizeMB: config.final_size / (1024 * 1024),
            maxWidthOrHeight: config.maxWidthOrHeight,
            onProgress: (progress) => {
              useImageCropper.setState({
                compressionProgress: progress,
                compressCount: count,
              });
            },
          });
        }

        console.log(targetFile.size, "Compressed");

        useImageCropper.setState({
          compressedFile: targetFile,
        });
      } catch (error) {
        const toast = new Toaster({
          id: "error-compression",
          title: translate(etm.generic.construct()),
          type: "error",
          trigger: false,
        });

        if (error instanceof AppError) {
          toast.update({
            description: translate(error.message),
          });
        } else {
          toast.update({
            description: translate(etm.unknown_error.construct()),
          });
        }

        toast.trigger();
      }
    };

    compress();
  }, [data, compressedFile, translate]);

  const title = "Crop Image";
  const desc = "";

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />

        <Footer />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className={"p-4"}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />

        <Footer />
      </DialogContent>
    </Dialog>
  );
};
export default ImageCropperDialog;
