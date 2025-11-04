"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

export const OverviewCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  const containerRef = useRef(null);

  const rotationValues = [8, 4, -4, -8];

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      rotate: rotationValues[Math.floor(Math.random() * rotationValues.length)],
    });
  });

  const handleOnMouseEnter = () => {
    gsap.to(containerRef.current, {
      rotate: 0,
      scale: 1.2,
      marginLeft: 60,
      marginRight: 60,
      duration: 0.8,
      ease: "elastic.out(0.5,0.4)",
    });
  };

  const handleOnMouseLeave = () => {
    gsap.to(containerRef.current, {
      rotate: rotationValues[Math.floor(Math.random() * rotationValues.length)],
      scale: 1,
      marginLeft: 0,
      marginRight: 0,
      duration: 0.8,
      ease: "elastic.out(0.5,0.4)",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className="p-2 outline-2 min-w-72 max-w-72 space-y-4 h-92 shadow-2xl rounded-lg bg-background"
    >
      {/* Illo */}
      <div className="bg-muted rounded-lg flex-center">
        <Image
          width={230}
          height={380}
          alt="Developer Illo"
          src={image}
          className="w-[180px]"
        />
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <h1 className="text-3xl font-bold opacity-65">{title}</h1>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
};
