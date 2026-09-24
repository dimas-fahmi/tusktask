import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const generateUsername = () => {
  return uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      ["-"],
      animals,
      NumberDictionary.generate({ min: 10, max: 9999 }),
    ],
    style: "lowerCase",
    separator: "",
    length: 4,
  });
};
