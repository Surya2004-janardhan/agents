import rateLimit from 'express-rate-limit';
import { redisClient } from '../lib/redis';

function makeStore() {
  // Use memory store if Redis not ready (fallback for dev)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { RedisStore } = require('rate-limit-redis');
    return new RedisStore({ sendCommand: (...args: string[]) => (redisClient as any).sendCommand(args) });
  } catch {
    return undefined;
  }
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  store: makeStore(),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded, please wait before sending more requests' },
});
