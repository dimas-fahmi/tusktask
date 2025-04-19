import React from "react";

export interface SectionCardProps {
  children?: React.ReactNode;
  title: string;
  label?: string;
  onClick?: () => unknown;
  number?: number;
}

const SectionCard: React.FC<SectionCardProps> = ({
  children,
  label,
  number,
  title,
  onClick,
}) => {
  return (
    <div className="">
      <header className="flex justify-between mb-3">
        <span className="tracking-tight font-semibold flex gap-2 items-end">
          <h4 className="text-tt-primary-foreground/90 capitalize">{title}</h4>
          <span className="text-tt-primary-foreground/40 text-sm">
            {number}
          </span>
        </span>
        {label && (
          <button
            onClick={onClick}
            className="font-semibold text-tt-tertiary transition-all duration-300 cursor-pointer px-3 py-1 hover:bg-tt-tertiary/20 rounded-3xl"
          >
            {label}
          </button>
        )}
      </header>
      <div className="grid grid-1 gap-3 md:gap-4">{children}</div>
    </div>
  );
};

export default SectionCard;
