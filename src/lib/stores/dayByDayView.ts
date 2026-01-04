"use client";

import { create } from "zustand";

export interface DayByDayViewStore {
  index: number;
  setIndex: (index: number) => void;
  getActiveDate: (index: number) => Date;
}

const getActiveDate = (index = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + index);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const useDayByDayViewStore = create<DayByDayViewStore>((set) => ({
  index: 0,
  setIndex: (index) => set({ index }),
  getActiveDate,
}));
