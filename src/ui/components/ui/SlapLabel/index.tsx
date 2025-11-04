"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const SlapLabel = ({
  text,
  fallDirection,
  fallDelay,
}: {
  text: string;
  fallDirection: "left" | "right";
  fallDelay?: number;
}) => {
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!labelRef.current) return;

    const tl = gsap.timeline();

    tl.to({}, { duration: fallDelay || 0.6 });

    tl.to(labelRef.current, {
      rotation: fallDirection === "left" ? -4 : 4,
      y: 9,
      duration: 1.2,
      ease: "bounce.out",
    });
  });

  const handleMouseEnter = () => {
    if (!labelRef.current) return;

    gsap.to(labelRef.current, {
      rotation: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const handleMouseLeave = () => {
    if (!labelRef.current) return;

    gsap.to(labelRef.current, {
      rotation: fallDirection === "left" ? -4 : 4,
      y: 7,
      duration: 0.8,
      ease: "bounce.out",
    });
  };

  return (
    <span
      ref={labelRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="text-primary inline-block"
    >
      {text}
    </span>
  );
};

export default SlapLabel;
