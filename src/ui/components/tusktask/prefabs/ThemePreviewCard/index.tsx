import Image from "next/image";
import React from "react";

const ThemePreviewCard = ({
  image,
  name,
  active = false,
  onClick = () => {},
}: {
  image: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`${active ? "bg-accent text-accent-foreground" : ""} border w-fit p-2 rounded-md `}
      onClick={onClick}
    >
      <div className="border w-fit rounded-md overflow-hidden">
        <Image
          width={280}
          height={280}
          src={image ?? "/images/theme-preview.png"}
          alt="Theme Preview"
        />
      </div>
      <div>
        <h1 className="font-semibold text-sm mt-1">{name}</h1>
      </div>
    </div>
  );
};

export default ThemePreviewCard;
