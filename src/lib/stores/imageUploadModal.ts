import type { Area } from "react-easy-crop";
import { create } from "zustand";

export interface Crop {
  x: number;
  y: number;
}

export interface CropperStatus {
  code: string;
  message?: string;
  progress?: number;
}

export interface ImageUploadModalStore {
  open: boolean;
  setOpen: (open: boolean) => void;

  cropperOpen: boolean;
  setCropperOpen: (open: boolean) => void;

  preview: string | null;
  setPreview: (preview: string | null) => void;

  cropperStatus: CropperStatus;
  setCropperStatus: (cropperStatus: CropperStatus) => void;

  crop: Crop;
  setCrop: (crop: Crop) => void;

  zoom: number;
  setZoom: (zoom: number) => void;

  croppedAreaPixels: Area | null;
  setCroppedAreaPixels: (croppedAreaPixels: Area | null) => void;

  croppingImage: string | null;
  setCroppingImage: (croppingImage: string | null) => void;

  file: File | null;
  setFile: (file: File | null) => void;

  blob: Blob | null;
  setBlob: (blob: Blob | null) => void;

  compressedFile: File | null;
  setCompressedFile: (file: File | null) => void;

  reset: () => void;
}

const defaultValues = {
  cropperStatus: {
    code: "idle",
    message: undefined,
    progress: undefined,
  },
  preview: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  croppingImage: null,
  compressedFile: null,
};

export const useImageUploadModalStore = create<ImageUploadModalStore>(
  (set) => ({
    // Dialog State
    open: false,
    cropperOpen: false,

    // Default values
    ...defaultValues,

    file: null,
    blob: null,

    // Setter
    setOpen: (open) => set({ open }),
    setCropperStatus: (n) => set({ cropperStatus: n }),
    setPreview: (n) => set({ preview: n }),
    setCrop: (n) => set({ crop: n }),
    setZoom: (n) => set({ zoom: n }),
    setCroppedAreaPixels: (n) => set({ croppedAreaPixels: n }),
    setCroppingImage: (n) => set({ croppingImage: n }),
    setFile: (n) => set({ file: n }),
    setBlob: (n) => set({ blob: n }),
    setCropperOpen: (n) => set({ cropperOpen: n }),
    setCompressedFile: (compressedFile) => set({ compressedFile }),

    // Reset
    reset: () => set(defaultValues),
  }),
);
