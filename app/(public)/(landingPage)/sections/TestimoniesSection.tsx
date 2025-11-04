"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import TestimonyBlock from "../components/TestimonyBlock";

const testimonies = [
  {
    id: crypto.randomUUID(),
    name: "Hasan Salim",
    role: "Software Engineer",
    title: "Amazing Customer Service",
    content: `TuskTask has completely changed how I manage my day. The Pomodoro timer helps me stay focused, and the team was incredibly responsive when I had questions.`,
    image: "/assets/images/png/lp-testimony-salim.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Salma Fayza",
    role: "UI/UX Designer",
    title: "Keeps Me Consistent",
    content: `I love the recurring task feature! I use it to schedule my daily design review sessions. The reminders on Telegram make sure I never miss anything important.`,
    image: "/assets/images/png/lp-testimony-salma-fayza.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Daniel Lim",
    role: "Entrepreneur",
    title: "Perfect for Busy Founders",
    content: `Between meetings and planning, TuskTask keeps me on track. I especially like the subtasks feature—it helps me break down complex projects into smaller, doable steps.`,
    image: "/assets/images/png/lp-testimony-daniel-lim.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Nurul Fatimah",
    role: "Student",
    title: "Pomodoro Helps Me Study Better",
    content: `I use TuskTask every day for my study sessions. The built-in Pomodoro timer keeps me focused, and I love getting Telegram reminders when it’s time to take a break.`,
    image: "/assets/images/png/lp-testimony-nurul-fatimah.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Michael Freeman",
    role: "Freelance Writer",
    title: "All My Tasks in One Place",
    content: `TuskTask helps me manage clients and deadlines effortlessly. The recurring task feature and Telegram integration are game changers for my productivity.`,
    image: "/assets/images/png/lp-testimony-michael-freeman.png",
  },
];

const TestimoniesSection = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const blocks = gsap.utils?.toArray(".testimony-block");
      gsap.to(blocks, {
        xPercent: -100 * (blocks.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          // base vertical scrolling on how wide the container is so it feels more natural.
          end: "+=3500",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="flex flex-nowrap overflow-x-scroll scrollbar-none"
    >
      {testimonies.map((testimony) => (
        <TestimonyBlock key={testimony.id} {...testimony} />
      ))}
    </section>
  );
};

export default TestimoniesSection;
