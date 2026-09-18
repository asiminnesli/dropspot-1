/**
 * Architectural migration: Replace Prisma relational persistence with Redis key-value store.
 * Drop documents and claim histories are persisted directly to Redis keys instead of PostgreSQL via Prisma.
 */
export class RedisDropRepository {
  private redisClient: any;

  constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  async saveDrop(dropId: string, dropData: Record<string, any>): Promise<void> {
    await this.redisClient.set(`drop:${dropId}`, JSON.stringify(dropData));
  }

  async getDrop(dropId: string): Promise<Record<string, any> | null> {
    const data = await this.redisClient.get(`drop:${dropId}`);
    return data ? JSON.parse(data) : null;
  }

  async recordClaim(dropId: string, userId: string): Promise<void> {
    await this.redisClient.sadd(`drop:${dropId}:claims`, userId);
  }
}
