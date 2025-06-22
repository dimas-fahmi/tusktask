import React from "react";

type DigitInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const formatWithDots = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const unformat = (value: string) => value.replace(/\./g, "");

const DigitInput: React.FC<DigitInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const unformatted = unformat(raw);
    const formatted = formatWithDots(unformatted);
    onChange(unformatted); // send numeric string (without dots) to react-hook-form
  };

  const formattedValue = formatWithDots(value || "");

  return (
    <input
      type="text"
      inputMode="numeric"
      value={formattedValue}
      onChange={handleChange}
      className={`text-center py-2 px-4 border rounded-md ${className || ""}`}
      placeholder="Enter number"
    />
  );
};

export default DigitInput;
