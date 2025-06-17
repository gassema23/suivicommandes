/**
 * Redis configuration settings.
 * Uses environment variables to configure the connection to Redis.
 * @module redis.config
 */
export const RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
};
