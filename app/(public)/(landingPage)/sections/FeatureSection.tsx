"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { getValueByInterval } from "@/src/lib/utils/getValueByInterval";
import type { FeatureBlockProps } from "../components/FeatureBlock";
import FeatureBlock from "../components/FeatureBlock";

const features = [
  {
    id: crypto.randomUUID(),
    title: "Pomodoro Timer",
    description:
      "Stay focused using built-in Pomodoro sessions with automatic breaks to prevent burnout and boost efficiency.",
    image: "/assets/arts/png/lp-pomodoro.png",
    imageAlt: "Pomodoro timer illustration",
  },
  {
    id: crypto.randomUUID(),
    title: "Nested Tasks",
    description:
      "Break down big goals into smaller, actionable subtasks — making progress clearer and easier to track.",
    image: "/assets/arts/png/lp-todo-board.png",
    imageAlt: "Task and subtasks visualization",
  },
  {
    id: crypto.randomUUID(),
    title: "Recurring Tasks",
    description:
      "Automate your routine by setting daily, weekly, or monthly repeating tasks — perfect for habits and maintenance work.",
    image: "/assets/arts/png/lp-breath-habit.png",
    imageAlt: "Recurring tasks illustration",
  },
  {
    id: crypto.randomUUID(),
    title: "Telegram Reminders",
    description:
      "Never miss a deadline — get instant reminders directly in Telegram when your tasks are due or overdue.",
    image: "/assets/arts/png/lp-tusky-telegram.png",
    imageAlt: "Telegram reminder notification illustration",
  },
  {
    id: crypto.randomUUID(),
    title: "Smart Insights",
    description:
      "Visualize your productivity trends with charts and insights that help you identify when and how you work best.",
    image: "/assets/arts/png/lp-pie-chart.png",
    imageAlt: "Productivity insights chart illustration",
  },
  {
    id: crypto.randomUUID(),
    title: "Cloud Based",
    description:
      "Keep your tasks safe and accessible everywhere with secure cloud synchronization and automatic backup.",
    image: "/assets/arts/png/lp-cloud.png",
    imageAlt: "Cloud synchronization illustration",
  },
] as const;

const FeatureSection = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      // Register Plugin
      gsap.registerPlugin(SplitText, ScrollTrigger);

      const split = SplitText.create(headerRef.current);

      gsap.from(split.words, {
        y: 50,
        opacity: 0,
        scale: 0.4,
        stagger: 0.05,
        duration: 0.5,
        scrollTrigger: {
          trigger: split.words,
          start: "top 90%",
          end: "top center",
          toggleActions: "play none none none",
        },
      });
    },
    {
      scope: headerRef,
    },
  );

  return (
    <section className="layout-padding space-y-12">
      {/* Header */}
      <header ref={headerRef} className="text-center space-y-2">
        <h1 className="text-4xl font-bold">What Make TuskTask Special</h1>
        <p className="font-light">This is why people loved us</p>
      </header>

      {/* Features Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <FeatureBlock
            key={feature.id}
            {...feature}
            variant={getValueByInterval<FeatureBlockProps["variant"]>(
              3,
              index,
              ["primary", "secondary", "tertiary"],
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
