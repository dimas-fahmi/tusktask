import type { Messages } from "../definition";
import { ErrorTranslation } from ".";

export type ErrorTranslationKey = keyof Messages["error"];

const serializer = ErrorTranslation.createSerializer<ErrorTranslationKey>();

export const et = ErrorTranslation.init<ErrorTranslationKey>()({
  messages: {
    generic: {
      construct: () =>
        serializer({
          key: "generic",
        }),
    },

    string_invalid: {
      construct: () =>
        serializer({
          key: "string_invalid",
        }),
    },

    string_min: {
      construct: (min: number) =>
        serializer({
          key: "string_min",
          params: [min],
        }),
      interpolation: (params) => ({
        min: params[0],
      }),
    },

    string_max: {
      construct: (max: number) =>
        serializer({ key: "string_max", params: [max] }),
      interpolation: (params) => ({ max: params[0] }),
    },

    file_format_unsupported: {
      construct: (formats: string) =>
        serializer({
          key: "file_format_unsupported",
          params: [formats],
        }),
      interpolation: (params) => ({ formats: params[0] }),
    },

    file_too_large: {
      construct: (max: string) =>
        serializer({
          key: "file_too_large",
          params: [max],
        }),
      interpolation: (params) => ({ max: params[0] }),
    },

    object_invalid: {
      construct: () =>
        serializer({
          key: "object_invalid",
        }),
    },

    session_invalid: {
      construct: () =>
        serializer({
          key: "session_invalid",
        }),
    },

    session_undefined: {
      construct: () =>
        serializer({
          key: "session_undefined",
        }),
    },

    unknown_error: {
      construct: () =>
        serializer({
          key: "unknown_error",
        }),
    },
  },
});

export const etm = et.messages;
export const deserializer = ErrorTranslation.createDeserializer(etm);
