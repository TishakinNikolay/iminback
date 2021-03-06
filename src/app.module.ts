import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TypeOrmModule} from '@nestjs/typeorm';
import {config} from 'dotenv';
import {rootPath} from 'get-root-path';
import {join} from 'path';
import {SharedModule} from './api-modules/_shared/shared.module';
import {CategoryModule} from './api-modules/category/category.module';
import {EventModule} from './api-modules/event/event.module';
import {ImageModule} from './api-modules/image/image.module';
import {MapModule} from './api-modules/map/map.module';
import {UserModule} from './api-modules/user/user.module';
import dbConfig from './database/db-config';
import { PushNotificationModule } from './api-modules/push-notifications/push-notification.module';
import {TestModule} from "./api-modules/test/test.module";
import {RedisModule} from "nestjs-redis";

config();

@Module({
    imports: [
        // Custom Modules
        EventModule,
        MapModule,
        ImageModule,
        UserModule,
        CategoryModule,
        SharedModule,
        PushNotificationModule,
        // Custom Modules
        RedisModule.register({
            password: process.env.REDIS_PASSWORD,
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST
        }),
        TypeOrmModule.forRoot(dbConfig),
        TestModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(rootPath, process.env.IMAGE_LOCAL_FOLDER_RELATIVE_PATH)
        })
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
