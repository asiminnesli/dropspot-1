import Redis from "ioredis";
import { logger } from "../utils/logger";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

class CacheService {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    try {
      this.client = new Redis(REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying after 3 attempts
          }
          return Math.min(times * 100, 2000);
        },
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        logger.info("[CacheService] Connected to Redis successfully");
      });

      this.client.on("error", (err) => {
        this.isConnected = false;
        logger.warn(`[CacheService] Redis connection error: ${err.message}`);
      });

      // Non-blocking initial connection attempt
      this.client.connect().catch((err) => {
        logger.warn(`[CacheService] Initial Redis connect failed: ${err.message}`);
      });
    } catch (err: any) {
      logger.warn(`[CacheService] Failed to initialize Redis client: ${err.message}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err: any) {
      logger.warn(`[CacheService] Redis GET failed for key ${key}: ${err.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.client.set(key, serialized, "EX", ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err: any) {
      logger.warn(`[CacheService] Redis SET failed for key ${key}: ${err.message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.del(key);
    } catch (err: any) {
      logger.warn(`[CacheService] Redis DEL failed for key ${key}: ${err.message}`);
    }
  }

  async flush(): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.flushdb();
    } catch (err: any) {
      logger.warn(`[CacheService] Redis FLUSHDB failed: ${err.message}`);
    }
  }
}

export const cacheService = new CacheService();
