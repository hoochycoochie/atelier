import { IException } from 'core/exceptions/exceptions.interface';
import { ILogger } from 'core/logger/logger.interface';
import { IPlayerRepository, StatisticEntity } from 'core/repositories';
import { PlayerStatsUseCase } from './player-stats.usecase';

describe('PlayerStatsUseCase', () => {
  let playerStatsUseCase: PlayerStatsUseCase;

  let logger: ILogger;
  let exception: IException;

  let repository: IPlayerRepository;

  beforeEach(() => {
    logger = {} as ILogger;
    logger.log = jest.fn();
    logger.debug = jest.fn();
    logger.error = jest.fn();
    logger.warn = jest.fn();

    exception = {} as IException;
    exception.UnauthorizedException = jest.fn();
    exception.badRequestException = jest.fn();
    exception.forbiddenException = jest.fn();
    exception.internalServerErrorException = jest.fn();
    exception.notFoundException = jest.fn();
    repository = {} as IPlayerRepository;
    repository.statistics = jest.fn();

    playerStatsUseCase = new PlayerStatsUseCase(repository, logger, exception);
  });

  describe('players statistocs ', () => {
    it('should throw error if occurs', async () => {
      (repository.statistics as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(playerStatsUseCase.execute()).rejects.toThrow();
    });

    it('should return statistics', async () => {
      const statisticEntity: StatisticEntity = {
        country: 'France',
        meanBodyMassIndex: 200,
        medianPlayerHeight: 180,
      };

      (repository.statistics as jest.Mock).mockResolvedValue(statisticEntity);

      await expect(playerStatsUseCase.execute()).resolves.toBeDefined();
    });
  });
});
