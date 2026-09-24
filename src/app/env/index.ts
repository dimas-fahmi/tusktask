import { ENV_PUBLIC_VALUES } from "./public";
import { ENV_SECRET_KEYS } from "./secret";

export function envUnhandledError(key: string) {
  return new Error(`ENV with a ${key} is undefined`);
}

export type EnvPublicKey = keyof typeof ENV_PUBLIC_VALUES;

export type EnvSecretKey = (typeof ENV_SECRET_KEYS)[number];

export type EnvKey = EnvPublicKey | EnvSecretKey;

function isEnvPublicKey(str?: unknown): str is EnvPublicKey {
  if (!str) return false;
  return Object.keys(ENV_PUBLIC_VALUES).includes(str as EnvPublicKey);
}

function isEnvSecretKey(str?: unknown): str is EnvSecretKey {
  if (!str) return false;
  return ENV_SECRET_KEYS.includes(str as EnvSecretKey);
}

export function getEnv(key: EnvKey): string {
  if (isEnvSecretKey(key)) {
    if (typeof window !== "undefined") {
      throw new Error(
        `${key} is a secret key, could only and should only be accessed within a server env.`,
      );
    }

    const value = process.env[key];

    if (!value) {
      throw envUnhandledError(key);
    }

    return value;
  }

  if (isEnvPublicKey(key)) {
    const value = ENV_PUBLIC_VALUES[key];

    if (!value) {
      throw envUnhandledError(key);
    }

    return value;
  }

  throw new Error(`${key} is an invalid key`);
}
