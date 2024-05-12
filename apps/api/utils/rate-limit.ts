import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
#=============================#=============================================#
# HTTP Header                 # Description                                 #
#=============================#=============================================#
| X-Rate-Limit-Limit          | Request limit per day                       |
+-----------------------------+---------------------------------------------+
| X-Rate-Limit-Remaining      | The number of requests left for the time    |
|                             | window                                      |
+-----------------------------+---------------------------------------------+
| X-Rate-Limit-Reset          | The remaining window before the rate limit  |
|                             | resets in UTC epoch seconds                 |
+-----------------------------+---------------------------------------------+
*/

export const readRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
});

export const writeRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30 m"),
  analytics: true,
});
