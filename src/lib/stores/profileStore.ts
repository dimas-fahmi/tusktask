import { create } from "zustand";
import type { UserType } from "@/src/db/schema/auth-schema";

export interface ProfileStore {
  profile?: UserType;
  setProfile: (profile: ProfileStore["profile"]) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: undefined,
  setProfile: (nv) => set({ profile: nv }),
}));
