import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const TestimonyBlockCover = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subheadingRef = useRef<HTMLParagraphElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const decorLineRef = useRef<HTMLDivElement | null>(null);
  const isWideScreen = useMediaQuery({
    query: `(min-width: 768px)`,
  });

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate the image from bottom-left corner expanding
      gsap.fromTo(
        imageContainerRef.current,
        {
          clipPath: "circle(10% at 0% 100%)",
          opacity: 0,
        },
        {
          clipPath: isWideScreen
            ? "circle(100% at 0% 98%)"
            : "circle(55% at 0% 60%)",
          opacity: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 20%",
            end: "bottom 50%",
            scrub: 1.5,
          },
        },
      );

      // Content container slides in from right with rotation
      gsap.fromTo(
        contentContainerRef.current,
        {
          x: 300,
          opacity: 0,
          rotateY: 45,
        },
        {
          x: 0,
          opacity: 0.9,
          rotateY: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "center 50%",
            scrub: 1,
          },
        },
      );

      // Badge flies in from top
      gsap.fromTo(
        badgeRef.current,
        {
          y: -100,
          opacity: 0,
          scale: 0.5,
          rotation: -20,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          scrollTrigger: {
            trigger: contentContainerRef.current,
            start: "top 65%",
            end: "top 45%",
            scrub: 1,
          },
        },
      );

      // Heading splits and reveals with perspective
      gsap.fromTo(
        headingRef.current?.children || [],
        {
          opacity: 0,
          x: 100,
          rotationX: 90,
          transformOrigin: "center center",
        },
        {
          opacity: 1,
          x: 0,
          rotationX: 0,
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentContainerRef.current,
            start: "top 60%",
            end: "top 35%",
            scrub: 1.2,
          },
        },
      );

      // Decorative line draws in
      gsap.fromTo(
        decorLineRef.current,
        {
          scaleX: 0,
          transformOrigin: "right center",
        },
        {
          scaleX: 1,
          scrollTrigger: {
            trigger: contentContainerRef.current,
            start: "top 55%",
            end: "top 30%",
            scrub: 1,
          },
        },
      );

      // Subheading glitches in
      gsap.fromTo(
        subheadingRef.current,
        {
          opacity: 0,
          y: 50,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: contentContainerRef.current,
            start: "top 50%",
            end: "top 25%",
            scrub: 1,
          },
        },
      );

      // Stats pop in with bounce
      gsap.fromTo(
        statsRef.current?.children || [],
        {
          opacity: 0,
          scale: 0,
          y: 80,
          rotation: 45,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          stagger: 0.12,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: contentContainerRef.current,
            start: "top 45%",
            end: "top 15%",
            scrub: 1,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative items-center p-4 md:p-12 lg:p-16 testimony-block min-w-dvw max-w-dvw min-h-dvh max-h-dvh flex justify-end overflow-hidden bg-background"
    >
      {/* Content */}
      <div
        ref={contentContainerRef}
        className="relative z-10 text-right overflow-hidden"
      >
        <div className="bg-background/95 backdrop-blur-xl rounded-3xl p-10">
          <div className="space-y-6">
            {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Trusted Worldwide
              </span>
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="flex font-bold font-header flex-col text-5xl leading-tight"
            >
              <span className="inline-block mb-2 text-2xl md:text-4xl">
                All Of Them Use
              </span>
              <span className="text-primary inline-block text-5xl md:text-7xl lg:text-9xl">
                TuskTask
              </span>
            </h1>

            {/* Decorative Line */}
            <div className="flex justify-end my-6">
              <div
                ref={decorLineRef}
                className="h-1 w-48 bg-linear-to-l from-primary via-primary/60 to-transparent rounded-full"
              />
            </div>

            {/* Subheading */}
            <p
              ref={subheadingRef}
              className="font-light text-foreground/70 max-w-xl ml-auto"
            >
              And all of them live happily ever after
            </p>

            {/* Stats Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-3 md:gap-4 pt-8 max-w-2xl ml-auto"
            >
              <div className="group relative overflow-hidden text-center p-5 md:p-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div
                    className={`text-2xl md:text-4xl font-black text-primary mb-1`}
                    suppressHydrationWarning
                  >
                    10K+
                  </div>
                  <div className="text-xs md:text-sm font-medium text-foreground/60 uppercase tracking-wider">
                    Users
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden text-center p-5 md:p-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-2xl md:text-4xl font-black text-primary mb-1">
                    98%
                  </div>
                  <div className="text-xs md:text-sm font-medium text-foreground/60 uppercase tracking-wider">
                    Satisfied
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden text-center p-5 md:p-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-2xl md:text-4xl font-black text-primary mb-1">
                    5.0★
                  </div>
                  <div className="text-xs md:text-sm font-medium text-foreground/60 uppercase tracking-wider">
                    Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop Image */}
      <div ref={imageContainerRef} className="absolute inset-0 -z-10">
        <Image
          fill
          src={
            "https://images.pexels.com/photos/2467506/pexels-photo-2467506.jpeg"
          }
          alt="Photo of People Smiling and Posing for a Picture"
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-background/80 via-background/40 to-transparent" />
      </div>
    </div>
  );
};

export default TestimonyBlockCover;
