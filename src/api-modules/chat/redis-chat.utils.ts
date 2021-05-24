import {RedisService} from "nestjs-redis";

export async function setUserIdAndSocketIdOnRedis(redisService: RedisService, userId: string, socketId: string) {
    await redisService.getClient().set(`users:${userId}`, socketId, 'NX', 'EX', 30);
}
