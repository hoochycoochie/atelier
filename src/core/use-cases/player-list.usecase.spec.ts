import { PlayerEntity } from 'core/entities/player.entity';
import { IException } from 'core/exceptions/exceptions.interface';
import { ILogger } from 'core/logger/logger.interface';
import { IPlayerRepository } from 'core/repositories';
import { PlayerListUseCase } from './player-list.usecase';

describe('PlayerFindByIdUseCase', () => {
  let playerListUseCase: PlayerListUseCase;

  let logger: ILogger;
  let exception: IException;

  let repository: IPlayerRepository;
  const players: PlayerEntity[] = [
    {
      id: 52,
      firstname: 'Novak',
      lastname: 'Djokovic',
      shortname: 'N.DJO',
      sex: 'M',
      country: {
        picture: 'https://tenisu.latelier.co/resources/Serbie.png',
        code: 'SRB',
      },
      picture: 'https://tenisu.latelier.co/resources/Djokovic.png',
      data: {
        rank: 2,
        points: 2542,
        weight: 80000,
        height: 188,
        age: 31,
        last: [1, 1, 1, 1, 1],
      },
    },

    {
      id: 95,
      firstname: 'Venus',
      lastname: 'Williams',
      shortname: 'V.WIL',
      sex: 'F',
      country: {
        picture: 'https://tenisu.latelier.co/resources/USA.png',
        code: 'USA',
      },
      picture: 'https://tenisu.latelier.co/resources/Venus.webp',
      data: {
        rank: 52,
        points: 1105,
        weight: 74000,
        height: 185,
        age: 38,
        last: [0, 1, 0, 0, 1],
      },
    },
  ];
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
    repository.find = jest.fn();

    playerListUseCase = new PlayerListUseCase(repository, logger, exception);
  });

  describe('players list ', () => {
    it('should throw error if occurs', async () => {
      (repository.find as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(playerListUseCase.execute({ limit: 10 })).rejects.toThrow();
    });

    it('should return list of players found', async () => {
      (repository.find as jest.Mock).mockResolvedValue(players);

      await expect(
        playerListUseCase.execute({ limit: 10 }),
      ).resolves.toBeDefined();
    });
  });
});
