"use client";

import { create } from "zustand";

export interface DayByDayStore {
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

export const useDayByDayStore = create<DayByDayStore>((set) => ({
  index: 0,
  setIndex: (index) => set({ index }),
  getActiveDate,
}));
