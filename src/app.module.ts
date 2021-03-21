import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { rootPath } from 'get-root-path';
import { join } from 'path';
import { EventModule } from './api-modules/event/event.module';
import { ImageModule } from './api-modules/image/image.module';
import {MapModule} from './api-modules/map/map.module';
import { UserModule } from './api-modules/user/user.module';
import dbConfig from './database/db-config';
config();

@Module({
  imports: [
    EventModule,
    MapModule,
    ImageModule,
    UserModule,
    TypeOrmModule.forRoot(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(rootPath, process.env.IMAGE_LOCAL_FOLDER_RELATIVE_PATH)
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
