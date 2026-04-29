import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379/0';

export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.error('[Redis] Client error', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('[Redis] Connected');
  }
}
