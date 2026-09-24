/** biome-ignore-all assist/source/organizeImports: Disabled organize import, readability. */
import type { SupportedLocale } from ".";

// Alert Dictionary
import type alertEn from "./messages/en/alert.json";
import type alertId from "./messages/id/alert.json";

// Attribution Dictionary
import type attributionEn from "./messages/en/attribution.json";
import type attributionId from "./messages/id/attribution.json";

// Common Dictionary
import type commonEn from "./messages/en/common.json";
import type commonId from "./messages/id/common.json";

// Error Dictionary
import type errorEn from "./messages/en/error.json";
import type errorId from "./messages/id/error.json";

// Page Dictionary
import type pageEn from "./messages/en/page.json";
import type pageId from "./messages/id/page.json";

// RegistrationStep Dictionary
import type registrationStepEn from "./messages/en/registrationStep.json";
import type registrationStepId from "./messages/id/registrationStep.json";

// Warning Dictionary
import type warningEn from "./messages/en/warning.json";
import type warningId from "./messages/id/warning.json";

export type Messages = {
  alert: typeof alertEn | typeof alertId;
  attribution: typeof attributionEn | typeof attributionId;
  common: typeof commonEn | typeof commonId;
  error: typeof errorEn | typeof errorId;
  page: typeof pageEn | typeof pageId;
  registrationStep: typeof registrationStepEn | typeof registrationStepId;
  warning: typeof warningEn | typeof warningId;
};

declare module "next-intl" {
  interface AppConfig {
    Locale: SupportedLocale;
    Messages: Messages;
  }
}
