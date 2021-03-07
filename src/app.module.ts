import { Module } from '@nestjs/common'
import { EventModule } from './api-modules/event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import  dbConfig from './database/db-config';
@Module({
  imports: [
    EventModule,
    TypeOrmModule.forRoot(dbConfig),
    ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule { }
