import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AllExceptionFilter } from 'infrastructure/common/filter/exception.filter';
import { LoggingInterceptor } from 'infrastructure/common/interceptors/logger.interceptor';
import {
  ResponseFormat,
  ResponseInterceptor,
} from 'infrastructure/common/interceptors/response.interceptor';
import { PlayerDto } from 'infrastructure/controllers/player/dto/player.dto';
import { StaticticDto } from 'infrastructure/controllers/player/dto/statistic.dto';
import { LoggerService } from 'infrastructure/logger/logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.use(compression());
  const configService = app.get(ConfigService);
  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    disableErrorMessages: configService.get('NODE_ENV') === 'production',
  });

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // swagger config

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Clean Architecture Atelier Tennis player')
    .setDescription('Tennis players')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ResponseFormat, PlayerDto, StaticticDto],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
