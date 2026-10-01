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

  today() {
    return `${this.app()}/today`;
  },

  upcoming() {
    return `${this.app()}/upcoming`;
  },

  calendar() {
    return `${this.app()}/calendar`;
  },

  settings(section?: "account" | "session" | "security") {
    return `${this.app()}/settings${section ? `/${section}` : ""}`;
  },
} as const;

export default route;
