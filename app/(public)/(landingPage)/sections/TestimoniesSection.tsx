"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import TestimonyBlock from "../components/TestimonyBlock";
import TestimonyBlockCover from "../components/TestimonyBlockCover";

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

      // First Quote Icon
      const tbFquoteIcons = gsap.utils?.toArray(
        ".testimony-block-first-quote-icon",
      ) as gsap.DOMTarget[];

      // Second Quote Icon
      const tbSquoteIcons = gsap.utils?.toArray(
        ".testimony-block-second-quote-icon",
      ) as gsap.DOMTarget[];

      // Name & Roles
      const tbNamesAndRoles = gsap.utils?.toArray(
        ".testimony-block-name-and-role",
      ) as gsap.DOMTarget[];

      // Images
      const tbImages = gsap.utils?.toArray(
        ".testimony-block-image",
      ) as gsap.DOMTarget[];

      // Titles
      const tbTitles = gsap.utils?.toArray(
        ".testimony-block-title",
      ) as gsap.DOMTarget[];

      // Contents
      const tbContents = gsap.utils?.toArray(
        ".testimony-block-content",
      ) as gsap.DOMTarget[];

      const containerAnimation = gsap.to(blocks, {
        xPercent: -100 * (blocks.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: "+=3500",
        },
      });

      // First Quote Icon Animation
      tbFquoteIcons.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          rotate: 360,
          scale: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            containerAnimation,
            trigger: item,
            start: "left 90%",
            end: "left 50%",
            scrub: true,
          },
        });
      });

      // Second Quote Icon Animation
      tbSquoteIcons.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          rotate: 360,
          scale: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            containerAnimation,
            trigger: item,
            start: "left 95%",
            end: "left 80%",
            scrub: true,
          },
        });
      });

      // Namme and Roles
      tbNamesAndRoles.forEach((item) => {
        gsap.from(item, {
          x: -50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            containerAnimation,
            trigger: item,
            scrub: true,
            start: "left 80%",
            end: "left 40%",
          },
        });
      });

      // Image Animation
      tbImages.forEach((item) => {
        gsap.from(item, {
          scale: 0.7,
          opacity: 0,
          scrollTrigger: {
            containerAnimation,
            trigger: item,
            start: "left 90%",
            end: "left 20%",
            scrub: true,
          },
        });
      });

      // Title
      tbTitles.forEach((item) => {
        gsap.from(item, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            containerAnimation,
            trigger: item,
            start: "left 90%",
            end: "left center",
            scrub: true,
          },
        });
      });

      // Contents
      tbContents.forEach((item) => {
        gsap.from(item, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            containerAnimation,
            trigger: item,
            start: "left 90%",
            end: "left center",
            scrub: true,
          },
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="flex flex-nowrap overflow-x-scroll scrollbar-none"
    >
      <TestimonyBlockCover />

      {testimonies.map((testimony) => (
        <TestimonyBlock key={testimony.id} {...testimony} />
      ))}
    </section>
  );
};

export default TestimoniesSection;
