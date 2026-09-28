import type { Area, Point } from "react-easy-crop";
import { create } from "zustand";
import type { ImageShape, ImgCategoryKey } from "../app/image/config";
import { abortImageCompression } from "../utils/clientOnly/browserImageCompression";

export type ImageCropperInfo = {
  originalSize?: number;
  compressedSize?: number;
  compressCount?: number;
  croppedSize?: number;
};

export type ImageCropperData = {
  file: File;
  config: ImgCategoryKey;
  callback?: (blob: Blob, info: ImageCropperInfo) => void;
  defaultShape?: ImageShape;
};

export type ImageCropperStates = {
  data: ImageCropperData | null;
  compressedFile: File | null;
  previewUrl: string | null;
  compressCount: number;
  aspectRatio: number;
  crop: Point;
  zoom: number;
  croppedAreaPixels: Area | null;
  compressionProgress: number;
  shape: ImageShape;
};

export type ImageCropperActions = {
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (area: Area) => void;

  triggerCropper: (data: ImageCropperData) => void;
  reset: () => void;
};

export type ImageCropperStore = ImageCropperStates & ImageCropperActions;

export const IMAGE_CROPPER_STATE_DEFAULT = {
  compressCount: 0,
  compressedFile: null,
  data: null,
  previewUrl: null,
  aspectRatio: 1 / 1,
  croppedAreaPixels: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  compressionProgress: 0,
  shape: "rect",
} as const satisfies ImageCropperStates;

export const useImageCropper = create<ImageCropperStore>((set) => ({
  ...IMAGE_CROPPER_STATE_DEFAULT,

  onCropChange: (crop) => set({ crop }),
  onZoomChange: (zoom) => set({ zoom }),
  onCropComplete: (area) => set({ croppedAreaPixels: area }),

  triggerCropper: (data) =>
    set({
      data,
      shape: data?.defaultShape,
    }),

  reset: () => {
    set({
      ...IMAGE_CROPPER_STATE_DEFAULT,
    });

    abortImageCompression();
  },
}));
