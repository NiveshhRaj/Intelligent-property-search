import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { getTypeOrmConfig } from './database/typeorm.config';
import { HealthModule } from './health/health.module';
import { LoggerService } from './common/logger/logger.service';
import { PropertiesModule } from './properties/properties.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    HealthModule,
    PropertiesModule,
    SearchModule,
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule {}
