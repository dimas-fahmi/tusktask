import { Button } from "@/src/ui/components/shadcn/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/shadcn/utils";
import React from "react";
import Hugo from "../../../svg/logos/Hugo";
import Axure from "../../../svg/logos/Axure";
import Stripe from "../../../svg/logos/Stripe";
import Coursera from "../../../svg/logos/Cousera";
import { motion } from "motion/react";
import { animate } from "motion";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const heroContent = {
    title: "Oops, Did You Just Killed Your Plant Again?",
    subtitle:
      "Never Again! With Tuskask, we'll remind you of every event, task, and goal effortlessly.",
    primaryCta: "Get Started",
    secondaryCta: "Learn More",
    image: {
      src: "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/landing-01-hero.png",
      alt: "Illustration of Mabel the cat",
      width: 360,
      height: 360,
    },
  };

  const imageVariants = {
    animate: {
      x: [-5, 5],
      scale: [1, 1.05, 1],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          duration: 2,
          ease: "easeInOut",
        },
        scale: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 4,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <section
      className={cn(
        "container mx-auto grid gap-8 px-4 py-4 md:grid-cols-2 md:gap-12 lg:gap-16",
        className
      )}
      aria-labelledby="hero-title"
    >
      {/* Text Content */}
      <div className="flex flex-col justify-end space-y-6">
        <h1
          id="hero-title"
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {heroContent.title}
        </h1>
        <p className="text-lg text-muted-foreground">{heroContent.subtitle}</p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/signin">{heroContent.primaryCta}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guides">{heroContent.secondaryCta}</Link>
          </Button>
        </div>

        <div>
          <span className="text-tt-primary-foreground/70">
            Trusted by teams at
          </span>
          <div className="text-5xl flex gap-4">
            <Hugo />
            <Axure />
            <Stripe />
            <Coursera />
          </div>
        </div>
      </div>

      {/* Illustration */}
      <motion.div
        variants={imageVariants}
        animate="animate"
        className="flex items-center justify-center"
      >
        <Image
          src={heroContent.image.src}
          alt={heroContent.image.alt}
          width={heroContent.image.width}
          height={heroContent.image.height}
          priority
          className="max-w-full h-auto"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
