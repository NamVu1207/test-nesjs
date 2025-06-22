import Redis from 'ioredis';
export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    });
    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    return redis;
  },
};
