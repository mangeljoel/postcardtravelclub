const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

const jwt = require("jsonwebtoken");


const RATE_LIMIT = 5; // requests
const TIME_WINDOW = 14400; // 4 hours

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.path !== "/api/chats/startchat") {
      return next(); // only apply to startchat
    }

    try {
      const authHeader = ctx.request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return ctx.unauthorized("Missing or invalid token");
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id;
      const redisKey = `rate_limit:user:${userId}`;

      const current = await redis.incr(redisKey);

      if (current === 1) {
        // Set expiry for first request
        await redis.expire(redisKey, TIME_WINDOW);
      }

      if (current > RATE_LIMIT) {
        ctx.status = 429;
        ctx.body = {
          message: "Too many requests. Please try again later.",
        };
        return;
      }

      return next();
    } catch (err) {
      console.error("Rate limit error:", err);
      return ctx.unauthorized("Invalid token or internal error.");
    }
  };
};

