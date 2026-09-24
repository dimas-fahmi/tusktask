export const REGISTRATION_STEPS = [
  "attribution",
  "name",
  "username",
  "avatar",
  "confirmation",
  "completed",
] as const;

export type RegistrationStep = (typeof REGISTRATION_STEPS)[number];
export type PendingRegistrationStep = Exclude<RegistrationStep, "completed">;

export const DEFAULT_REGISTRATION_STEP: PendingRegistrationStep =
  "attribution" as const;
