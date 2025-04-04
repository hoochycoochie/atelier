import { DynamicModule, Module } from '@nestjs/common';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { PlayerFindByIdUseCase } from 'core/use-cases/player-findbyId.usecase';
import { PlayerListUseCase } from 'core/use-cases/player-list.usecase';
import { PlayerStatsUseCase } from 'core/use-cases/player-stats.usecase';
import { ExceptionsService } from 'infrastructure/exceptions/exceptions.service';

import { JsonfileModule } from 'infrastructure/jsonfile/jsonfile.module';
import { PlayserJsonRepositoryService } from 'infrastructure/jsonfile/playser-json-repository/playser-json-repository.service';
import { UseCaseProxy } from './usecases-proxy';

@Module({
  imports: [LoggerModule, JsonfileModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  static PLAYER_FIND_BY_ID_PROXY = 'playerFindByIdUseCase';
  static PLAYER_LIST_PROXY = 'playerListUseCase';
  static PLAYER_STATS_PROXY = 'playerStatsUseCase';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          provide: UsecasesProxyModule.PLAYER_FIND_BY_ID_PROXY,
          inject: [
            LoggerService,
            PlayserJsonRepositoryService,
            ExceptionsService,
          ],

          useFactory: (
            logger: LoggerService,

            repository: PlayserJsonRepositoryService,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new PlayerFindByIdUseCase(repository, logger, exception),
            ),
        },

        {
          provide: UsecasesProxyModule.PLAYER_LIST_PROXY,
          inject: [
            LoggerService,
            PlayserJsonRepositoryService,
            ExceptionsService,
          ],

          useFactory: (
            logger: LoggerService,

            repository: PlayserJsonRepositoryService,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new PlayerListUseCase(repository, logger, exception),
            ),
        },

        {
          provide: UsecasesProxyModule.PLAYER_STATS_PROXY,
          inject: [
            LoggerService,
            PlayserJsonRepositoryService,
            ExceptionsService,
          ],

          useFactory: (
            logger: LoggerService,

            repository: PlayserJsonRepositoryService,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new PlayerStatsUseCase(repository, logger, exception),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.PLAYER_FIND_BY_ID_PROXY,
        UsecasesProxyModule.PLAYER_LIST_PROXY,
        UsecasesProxyModule.PLAYER_STATS_PROXY,
      ],
    };
  }
}
