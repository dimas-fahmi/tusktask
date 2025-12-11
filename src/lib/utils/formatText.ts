export const capitalizeWord = (text: string): string => {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
};
