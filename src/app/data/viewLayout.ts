import {
  IconLayoutKanban,
  IconLayoutList,
  type TablerIcon,
} from "@tabler/icons-react";

export const VIEW_LAYOUTS = {
  list: {
    icon: IconLayoutList,
  },
  kanban: {
    icon: IconLayoutKanban,
  },
} as const satisfies Record<string, { icon: TablerIcon }>;

export type ViewLayout = keyof typeof VIEW_LAYOUTS;

export type ViewLayoutData = (typeof VIEW_LAYOUTS)[ViewLayout];

export const VIEW_LAYOUTS_ENTRIES = Object.entries(VIEW_LAYOUTS) as [
  ViewLayout,
  ViewLayoutData,
][];
