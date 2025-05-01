import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import redis from "@/database/redis";

const ratelimited = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimited;
