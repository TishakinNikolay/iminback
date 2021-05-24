import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import * as redis from 'redis'

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options): any {
        console.log(port)
        const server = super.createIOServer(port, options);
        console.log(server)

        const socketpub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {auth_pass: process.env.REDIS_PASSWORD, return_buffers: true});
        const socketsub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {auth_pass: process.env.REDIS_PASSWORD, return_buffers: true});

        // @ts-ignore
        const redisAdapter = redisIoAdapter(
            {pubClient: socketpub, subClient: socketsub});
        server.adapter(redisAdapter);
        return server;
    }
}
