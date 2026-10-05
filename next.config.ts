import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  allowedDevOrigins: ["192.168.1.33"],
};

const withNextIntl = createNextIntlPlugin(
  // Custom request path
  "./src/i18n/request.ts",
);
export default withNextIntl(nextConfig);
