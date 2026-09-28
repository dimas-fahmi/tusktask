import type { Messages } from "../definition";
import { ErrorTranslation, type MessageInstance } from ".";

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

    invalid_attribution_channel: {
      construct: () => serializer({ key: "invalid_attribution_channel" }),
    },

    username_min_rule: {
      construct: (min: number) =>
        serializer({
          key: "username_min_rule",
          params: [min],
        }),

      interpolation: (params) => ({ min: params[0] }),
    },

    username_max_rule: {
      construct: (max: number) =>
        serializer({
          key: "username_max_rule",
          params: [max],
        }),
      interpolation: (params) => ({ max: params[0] }),
    },

    username_start_rule: {
      construct: () => serializer({ key: "username_start_rule" }),
    },

    username_char_rule: {
      construct: () => serializer({ key: "username_char_rule" }),
    },

    username_end_rule: {
      construct: () => serializer({ key: "username_end_rule" }),
    },

    username_spec_char_rule: {
      construct: () => serializer({ key: "username_spec_char_rule" }),
    },

    invalid_parameter: {
      construct: (key: string) =>
        serializer({ key: "invalid_parameter", params: [key] }),
      interpolation: (params) => ({ key: params[0] }),
    },

    file_unable_to_read: {
      construct: () => serializer({ key: "file_unable_to_read" }),
    },

    file_unable_to_process: {
      construct: (code: number) =>
        serializer({ key: "file_unable_to_process", params: [code] }),
      interpolation: (params) => ({ code: params[0] }),
    },

    no_canvas_context: {
      construct: () => serializer({ key: "no_canvas_context" }),
    },
  },
});

export const etm = et.messages;
const etmMap = new Map(
  Object.entries(etm) as [ErrorTranslationKey, MessageInstance][],
);
export const deserializer = ErrorTranslation.createDeserializer(etmMap);
export const protoValidator = ErrorTranslation.createProtoValidator(etmMap);
