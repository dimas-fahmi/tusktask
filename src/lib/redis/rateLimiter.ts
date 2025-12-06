import { Ratelimit, type RatelimitConfig } from "@upstash/ratelimit";
import { redis } from ".";

export const rateLimiter = (config?: Partial<RatelimitConfig>) => {
  return new Ratelimit({
    analytics: true,
    timeout: 1000 * 30, // 30 seconds (default)
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    ...config,
  });
};
