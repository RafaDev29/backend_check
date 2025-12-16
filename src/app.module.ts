import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { appConfig, databaseConfig, validate } from './config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RecordModule } from './modules/record/record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [databaseConfig, appConfig],
    validate,
    cache: true,
  }),
  DatabaseModule,
  AuthModule, UsersModule, RecordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
 