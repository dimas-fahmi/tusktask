"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageSecondContainerRef = useRef<HTMLDivElement | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const isWideScreen = useMediaQuery({
    query: "(min-width: 768px)",
  });

  useGSAP(
    () => {
      // Register Plugin
      gsap.registerPlugin(ScrollTrigger, SplitText);

      // Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: true,
        },
      });

      tl.fromTo(
        imageContainerRef.current,
        {
          x: -200,
          opacity: 0,
          scale: 0.8,
          rotation: -5,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
        },
      );

      tl.fromTo(
        imageSecondContainerRef.current,
        {
          x: 200,
          opacity: 0,
          scale: 0.8,
          rotation: 5,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
        },
        "-=0.8",
      );

      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars" });
        tl.from(
          split.chars,
          {
            opacity: 0,
            y: 30,
            stagger: 0.03,
            duration: 0.5,
          },
          "-=0.5",
        );
      }

      tl.from(
        descriptionRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
        },
        "-=0.3",
      );

      tl.from(
        ctaRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
        },
        "-=0.3",
      );
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      className="layout-padding relative flex-center min-h-[480px] w-full overflow-hidden"
    >
      {/* Illo 1 */}
      <div ref={imageContainerRef} className="absolute left-0 top-0">
        <Image
          width={isWideScreen ? 280 : 180}
          height={isWideScreen ? 280 : 180}
          src={"/assets/arts/png/lp-poor-tusky.png"}
          alt="Poor Tusky Begging For Donation"
        />
      </div>

      <div ref={imageSecondContainerRef} className="absolute right-0 bottom-0">
        <Image
          width={isWideScreen ? 280 : 180}
          height={isWideScreen ? 280 : 180}
          src={"/assets/arts/png/lp-landowner-tusky.png"}
          alt="Wealthy Tusky Standing With Proud"
        />
      </div>

      <div
        ref={contentContainerRef}
        className="max-w-md text-center gap-6 md:gap-12 flex flex-col justify-center"
      >
        <div className="space-y-4 md:space-y-6">
          <h1 ref={titleRef} className="text-4xl md:text-8xl font-bold">
            Pricing
          </h1>
          <p ref={descriptionRef}>
            Just kidding, TuskTask is free and open source. Tho... Tusky won't
            mind if you're willing to donate.
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex gap-2 justify-center">
          <Button>Donate</Button>
          <Button variant={"outline"}>Github</Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
