import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import 'dotenv/config';
import {AllExceptionsFilter} from './api-modules/_shared/filters/all-exception.fiter';
import {AppModule} from './app.module';
// import {CustomStartup} from './utils/custom-startup';
import {RedisIoAdapter} from "./api-modules/_shared/adapters/redis.adapter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    console.log('wtf7');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({transform: true}));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(process.env.PORT || 3000);
}

bootstrap();
