import type React from "react";
import type { PendingRegistrationStep } from ".";
import AttributionPhase from "./phases/AttributionPhase";
import AvatarPhase from "./phases/AvatarPhase";
import ConfirmationPhase from "./phases/ConfirmationPhase";
import NamePhase from "./phases/NamePhase";
import UsernamePhase from "./phases/UsernamePhase";

export const RENDERABLE_REGISTRATION_STEP = {
  attribution: AttributionPhase,
  name: NamePhase,
  username: UsernamePhase,
  avatar: AvatarPhase,
  confirmation: ConfirmationPhase,
} as const satisfies Record<PendingRegistrationStep, React.FC>;

const keys = Object.keys(RENDERABLE_REGISTRATION_STEP);

export function getPhase(current: PendingRegistrationStep) {
  const index = keys.indexOf(current);

  const last = keys[index - 1];
  const next = keys[index + 1];

  return {
    last: last as PendingRegistrationStep | undefined,
    next: next as PendingRegistrationStep | undefined,
  };
}
