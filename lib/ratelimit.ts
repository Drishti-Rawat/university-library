import redis from "@/database/redis";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above



const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1m"), // 5 requests per 10 seconds,
  analytics: true,
 
  prefix: "@upstash/ratelimit",
});

export default ratelimit;
