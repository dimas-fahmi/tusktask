"use client";

import { useGSAP } from "@gsap/react";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

const featureBlockVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-background text-foreground border-foreground",
      secondary: "bg-blue-200",
      tertiary: "bg-green-200",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface FeatureBlockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureBlockVariants> {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const FeatureBlock = ({
  title,
  description,
  image,
  imageAlt,
  className,
  variant,
}: FeatureBlockProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  useGSAP(
    () => {
      // Register Plugin
      gsap.registerPlugin([ScrollTrigger, SplitText]);

      // Split title text into characters for animation
      const splitTitle = new SplitText(titleRef.current, {
        type: "chars,words,lines",
        charsClass: "char",
      });

      // Timeline with smooth entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });

      // Container fade and scale in
      tl.from(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      })
        // Title characters stagger in
        .from(
          splitTitle.chars,
          {
            opacity: 0,
            y: 20,
            rotationX: -90,
            transformOrigin: "top center",
            stagger: 0.02,
            duration: 0.6,
            ease: "back.out(1.2)",
          },
          "-=0.4",
        )
        // Description fades in
        .from(
          descriptionRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3",
        )
        // Image scales and rotates in
        .from(
          imageContainerRef.current,
          {
            opacity: 0,
            scale: 0.8,
            rotation: -10,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        )
        // CTA button entrance
        .from(
          ctaRef.current,
          {
            opacity: 0,
            x: -20,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        );

      // Parallax effect on scroll
      gsap.to(imageContainerRef.current, {
        y: -30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "border-[2px_2px_7px] min-h-72 max-h-72 p-4 md:p-6 flex justify-between border-foreground rounded-4xl",
        featureBlockVariants({ variant }),
        className,
      )}
    >
      {/* Content container */}
      <div className="flex flex-col justify-between gap-12">
        <div className="space-y-4">
          <h1
            ref={titleRef}
            className="text-2xl font-bold flex flex-col leading-7 max-w-27"
          >
            {title}
          </h1>

          <p ref={descriptionRef} className="text-xs font-light">
            {description}
          </p>
        </div>

        {/* CTA */}
        <button
          ref={ctaRef}
          type="button"
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="cta-icon p-2 w-9 h-9 rounded-full bg-foreground text-background flex-center">
            <ArrowRight className="w-6 h-6" />
          </span>
          <span className="cta-text">Learn More</span>
        </button>
      </div>

      {/* Image container */}
      <div ref={imageContainerRef} className="flex-center">
        <Image width={180} height={180} src={image} alt={imageAlt} />
      </div>
    </div>
  );
};

export default FeatureBlock;
