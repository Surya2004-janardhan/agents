import rateLimit from 'express-rate-limit';
import { redisClient } from '../lib/redis';

// We use a dynamic store wrapper that doesn't crash on startup
const getStore = () => {
  try {
    const { RedisStore } = require('rate-limit-redis');
    return new RedisStore({
      sendCommand: async (...args: string[]) => {
        // If Redis isn't open, we silently fail to allow the 
        // rate limiter to use its internal memory fallback
        if (!redisClient.isOpen) {
          return undefined; 
        }
        try {
          return await (redisClient as any).sendCommand(args);
        } catch (e) {
          return undefined;
        }
      },
    });
  } catch (error) {
    return undefined; // Fallback to memory store
  }
};

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  store: getStore(),
});

// Auth rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later' },
  store: getStore(),
});

// AI execution rate limiter
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded, please wait before sending more requests' },
  store: getStore(),
});
