import { parseDate } from "chrono-node";
import { ReplacementRules, replaceMultiple } from "./replaceMultiple";
import { NLP_INDONESIAN_RULE } from "../configs/parserReplacer/indonesians";

export const REGISTERED_RULES: ReplacementRules = [...NLP_INDONESIAN_RULE];

export const naturalLanguangeDateParse = (text?: string) => {
  if (!text) return { translatedText: null, date: null };

  const translatedText = replaceMultiple(text, REGISTERED_RULES, false);

  return {
    translatedText,
    date: parseDate(translatedText),
  };
};
