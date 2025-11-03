"use client";

import Image from "next/image";
import SlapLabel from "@/src/ui/components/ui/SlapLabel";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const HeroSection = () => {
  return (
    <section id="hero" className="p-4 md:p-6 lg:p-16 flex justify-between">
      {/* Content Container */}
      <div className="max-w-lg">
        <h1 className="text-6xl capitalize font-bold md:leading-16">
          Oops, did you forget to{" "}
          <SlapLabel fallDelay={1.2} text="Water" fallDirection="left" /> the{" "}
          <SlapLabel
            delay={0.5}
            fallDelay={1.2}
            text="Plant"
            fallDirection="right"
          />{" "}
          again?
        </h1>
        <p className="mt-6 italic max-w-md">
          Quit screwing up your life; We'll remember things for you, so that
          won't happened again!
        </p>

        {/* CTA */}
        <div className="mt-6 flex gap-4">
          <Button size={"lg"}>Yes, I Need This!</Button>
          <Button variant={"outline"} size={"lg"}>
            Features
          </Button>
        </div>
      </div>

      {/* Illo Container */}
      <div className="aspect-video hidden md:block">
        <Image
          width={500}
          height={500}
          src={"/assets/arts/png/hero-art-001.png"}
          alt="Hero Art"
        />
      </div>
    </section>
  );
};

export default HeroSection;
