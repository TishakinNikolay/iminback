import { Module } from '@nestjs/common';
import { EventModule } from './api-modules/event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './database/db-config';
import { ImageModule } from './api-modules/image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { config } from 'dotenv';
import { rootPath } from 'get-root-path';
config();

@Module({
  imports: [
    EventModule,
    ImageModule,
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
