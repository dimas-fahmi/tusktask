"use client";

import Image from "next/image";
import Link from "next/link";
import SlapLabel from "@/src/ui/components/ui/SlapLabel";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="p-4 md:p-6 lg:p-16 flex flex-col-reverse md:flex-row gap-6 justify-between"
    >
      {/* Content Container */}
      <div className="max-w-lg text-center md:text-left">
        <h1 className="text-4xl md:text-6xl capitalize font-bold md:leading-16">
          Oops, did you forget to{" "}
          <SlapLabel fallDelay={1} text="Water" fallDirection="left" /> the{" "}
          <SlapLabel fallDelay={2.5} text="Plant" fallDirection="right" />{" "}
          again?
        </h1>
        <p className="mt-6 italic max-w-md">
          Quit screwing up your life; We'll remember things for you, so that
          won't happened again!
        </p>

        {/* CTA */}
        <div className="mt-6 flex gap-4 justify-center md:justify-start">
          <Button size={"lg"} asChild>
            <Link href={"/auth"}>Yes, I Need This!</Link>
          </Button>
          <Button variant={"outline"} size={"lg"} asChild>
            <Link href={"#whosin"} scroll>
              Who's in?
            </Link>
          </Button>
        </div>
      </div>

      {/* Illo Container */}
      <div className="aspect-video flex justify-center">
        <Image
          width={500}
          height={500}
          src={"/assets/arts/png/hero-art-001.png"}
          alt="Hero Art"
          className="w-full md:w-auto"
        />
      </div>
    </section>
  );
};

export default HeroSection;
