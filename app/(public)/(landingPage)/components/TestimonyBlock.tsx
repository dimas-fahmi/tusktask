import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Quote } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const TestimonyBlock = ({
  title,
  image,
  name,
  role,
  content,
}: {
  title: string;
  image: string;
  name: string;
  role: string;
  content: string;
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const quote1Ref = useRef(null);
  const quote2Ref = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 2%",
        end: "bottom 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate image container (scale and fade in)
    tl.from(
      imageRef.current,
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      0,
    );

    // Animate first quote
    tl.from(
      quote1Ref.current,
      {
        opacity: 0,
        rotate: 360,
        scale: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      0.3,
    );

    // Animate name and role
    tl.from(
      nameRef.current,
      {
        x: -50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.5,
    );

    // Animate title
    tl.from(
      titleRef.current,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      0.7,
    );

    // Animate description
    tl.from(
      descRef.current,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.9,
    );

    tl.from(
      quote2Ref.current,
      {
        opacity: 0,
        rotate: -360,
        scale: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      1.1,
    );
  });

  return (
    <div
      ref={containerRef}
      className="testimony-block min-w-dvw min-h-dvh p-4 md:p-6 lg:p-16 flex items-center justify-center gap-4 md:gap-16"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        {/* Image */}
        <div className="flex items-center justify-center">
          <div
            ref={imageRef}
            className="relative bg-primary/70 shadow-2xl overflow-visible w-[280px] h-[280px] rounded-full"
          >
            <Image
              width={280}
              height={380}
              src={image}
              alt="Salim"
              className="absolute bottom-0 rounded-b-full"
              loading="eager"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-md space-y-6">
          <div ref={quote1Ref}>
            <Quote className="rotate-180 text-gray-600" size={32} />
          </div>

          <div ref={nameRef}>
            <span className="font-bold">{name}</span> -{" "}
            <span className="font-light">{role}</span>
          </div>

          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold">
            {title}
          </h1>

          <p ref={descRef} className="font-light text-gray-600">
            {content}
          </p>

          <div ref={quote2Ref} className="flex justify-end">
            <Quote className="text-gray-600" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonyBlock;
