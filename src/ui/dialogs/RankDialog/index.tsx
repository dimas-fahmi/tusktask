"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { animate, motion, useMotionValue } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { RANKS } from "@/src/app/data/userRank";
import { useMyData } from "@/src/hooks/useMyData";
import { useRank } from "@/src/hooks/useRankDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcn/components/ui/drawer";
import { Progress } from "../../shadcn/components/ui/progress";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const cards = RANKS;

const RankCard = ({ rank }: { rank: (typeof RANKS)[number] }) => {
  const t = useTranslations();

  const { data: myData } = useMyData();

  return (
    <div className="min-w-full space-y-4">
      {/* Image */}
      <div className="w-[180px] aspect-square mx-auto">
        <Avatar className={"w-full h-full"}>
          <AvatarImage src={`/res/arts/ranks/${rank.id}.webp`} />
          <AvatarFallback>{rank.id[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center flex flex-col items-center space-y-1">
        <h1>{t(`rank.${rank.id}.title`)}</h1>
        <p className="text-xs font-light max-w-xs min-h-10">
          {t(`rank.${rank.id}.description`)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-light flex items-center justify-between">
          <span>{t("common.my_points")}</span>
          <span>{t(`rank.${rank.id}.title`)}</span>
        </div>
        <Progress
          value={myData?.points ?? 0}
          max={rank.min}
          className={"h-1.5"}
        />
        <div className="text-xs font-light flex items-center justify-between">
          <span>{myData?.points ?? 0}</span>
          <span>
            {rank.min <= (myData?.points ?? 0)
              ? "Achieved"
              : t("common.points_left", {
                  points: (rank.min - (myData?.points ?? 0)).toLocaleString(
                    "en-US",
                  ),
                })}
          </span>
        </div>
      </div>
    </div>
  );
};

const Body = () => {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(next, cards.length - 1));
    setIndex(clamped);

    const width = containerRef.current?.offsetWidth ?? 0;
    animate(x, -clamped * (width + 16), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex gap-4"
        style={{ x }}
        drag="x"
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) goTo(index + 1);
          else if (info.offset.x > 50) goTo(index - 1);
          else goTo(index);
        }}
      >
        {cards.map((card) => (
          <RankCard key={card.id} rank={card} />
        ))}
      </motion.div>

      <div className="mt-4 flex justify-center items-center gap-4">
        <Button
          variant={"outline"}
          size={"icon-xs"}
          onClick={() => {
            const target = index === 0 ? cards.length - 1 : index - 1;
            setIndex(target);
            goTo(target);
          }}
        >
          <IconChevronLeft />
        </Button>
        <div className="flex items-center justify-center gap-1">
          {cards.map((_, i) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: FKOF
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full border border-border transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
        <Button
          variant={"outline"}
          size={"icon-xs"}
          onClick={() => {
            const target = index + 1 === cards.length ? 0 : index + 1;
            setIndex(target);
            goTo(target);
          }}
        >
          <IconChevronRight />
        </Button>
      </div>
    </div>
  );
};

const Footer = () => {
  const t = useTranslations();
  const setOpen = useRank((s) => s.setOpen);

  return (
    <footer className="grid grid-cols-1">
      <Button
        variant={"outline"}
        onClick={() => {
          setOpen(false);
        }}
      >
        {t("common.close")}
      </Button>
    </footer>
  );
};

const RankDialog = () => {
  const t = useTranslations();

  const isMobile = useIsMobile();

  const [open, onOpenChange] = useRank(useShallow((s) => [s.open, s.setOpen]));

  const title = t("component.RankDialog.title");
  const desc = t("component.RankDialog.desc");

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />

        <Footer />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />

        <Footer />
      </DialogContent>
    </Dialog>
  );
};
export default RankDialog;
