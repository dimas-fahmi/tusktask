const route = {
  homepage() {
    return "/";
  },

  signin() {
    return "/signin";
  },

  terms_of_service() {
    return "/terms-of-service";
  },

  privacy_policy() {
    return "/privacy-policy";
  },

  app() {
    return "/app";
  },

  onboarding() {
    return "/registration";
  },
} as const;

export default route;
