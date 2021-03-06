import { Module } from '@nestjs/common'
import { EventModule } from './api-modules/event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EventModule,
    TypeOrmModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
