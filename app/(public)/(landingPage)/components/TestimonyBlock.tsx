import { Quote } from "lucide-react";
import Image from "next/image";

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
  return (
    <div className="relative testimony-block min-w-dvw min-h-dvh p-4 md:p-6 lg:p-16 flex items-center justify-center gap-4 md:gap-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        {/* Image */}
        <div className="flex items-center justify-center">
          {/* ANIMATION_TARGET: testimony-block-image */}
          <div className="testimony-block-image relative bg-primary/70 shadow-2xl overflow-visible w-[280px] h-[280px] rounded-full">
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
          {/* ANIMATION_TARGET: testimony-block-first-quote-icon */}
          <div className="testimony-block-first-quote-icon w-fit opacity-50">
            <Quote className="rotate-180" size={32} />
          </div>

          {/* ANIMATION_TARGET: testimony-block-name-and-role */}
          <div className="testimony-block-name-and-role">
            <span className="font-bold">{name}</span> -{" "}
            <span className="font-light">{role}</span>
          </div>

          {/* ANIMATION_TARGET: testimony-block-title */}
          <h1 className="testimony-block-title text-4xl md:text-6xl font-bold">
            {title}
          </h1>

          {/* ANIMATION_TARGET: testimony-block-content */}
          <p className="testimony-block-content font-light opacity-80">
            {content}
          </p>

          {/* ANIMATION_TARGET: testimony-block-second-quote-icon */}
          <div className="flex testimony-block-second-quote-icon justify-end w-fit ms-auto opacity-50">
            <Quote size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonyBlock;
