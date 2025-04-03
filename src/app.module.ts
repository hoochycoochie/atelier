import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from 'infrastructure/controllers/controllers.module';
import { ExceptionsModule } from 'infrastructure/exceptions/exceptions.module';
import { LoggerModule } from 'infrastructure/logger/logger.module';
import { UsecasesProxyModule } from 'infrastructure/usecases-proxy/usecases-proxy.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
      }),
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
  ],
})
export class AppModule {}
