import {
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  ClipboardPen,
  FolderPen,
  ListEnd,
  ListPlus,
  ListStart,
  type LucideIcon,
  MessageCircle,
  UserLock,
  UserRoundPlus,
} from "lucide-react";

// IMAGES CONFIGURATIONS
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const ALLOWED_IMAGE_MAX_MIME_SIZE = 1024 * 1024 * 5;

// FALLBACKS
export const NO_IMAGE_FALLBACK_SQUARE =
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/arts/bernard-0001.webp";

// ENUMS
export const EVENT_TYPES = [
  "assigned_a_task",
  "claimed_a_task",
  "created_a_task",
  "demoted",
  "invited_to_a_project",
  "message",
  "promoted",
  "requested_a_promotion",
  "suspended",
  "updated_a_project",
  "updated_a_task",
] as const;

export type EventMetadataType = {
  labelProjectLog: string;
  icon: LucideIcon;
};

export const EVENTS_METADATA: Record<
  (typeof EVENT_TYPES)[number],
  EventMetadataType
> = {
  assigned_a_task: {
    labelProjectLog: "Assigned a task",
    icon: ListEnd,
  },
  claimed_a_task: {
    labelProjectLog: "Claimed a task",
    icon: ListStart,
  },
  created_a_task: {
    labelProjectLog: "Created a task",
    icon: ListPlus,
  },
  updated_a_task: {
    labelProjectLog: "Updated a task",
    icon: ClipboardPen,
  },
  demoted: {
    labelProjectLog: "Demoted a user",
    icon: ChevronsDown,
  },
  promoted: {
    labelProjectLog: "Promoted a user",
    icon: ChevronsUp,
  },
  suspended: {
    labelProjectLog: "Suspended a member",
    icon: UserLock,
  },
  invited_to_a_project: {
    labelProjectLog: "Invited someone to this project",
    icon: UserRoundPlus,
  },
  message: {
    labelProjectLog: "Posted a message to this project",
    icon: MessageCircle,
  },
  requested_a_promotion: {
    labelProjectLog: "Requested a a promotion",
    icon: ChevronUp,
  },
  updated_a_project: {
    labelProjectLog: "Updated this project",
    icon: FolderPen,
  },
};
