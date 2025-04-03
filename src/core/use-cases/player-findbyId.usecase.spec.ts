import { PlayerEntity } from 'core/entities/player.entity';
import { IException } from 'core/exceptions/exceptions.interface';
import { ILogger } from 'core/logger/logger.interface';
import { IPlayerRepository } from 'core/repositories';
import { PlayerFindByIdUseCase } from './player-findbyId.usecase';

describe('PlayerFindByIdUseCase', () => {
  let playerFindByIdUseCase: PlayerFindByIdUseCase;

  let logger: ILogger;
  let exception: IException;

  let repository: IPlayerRepository;
  const player: PlayerEntity = {
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
  };
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
    repository.findOne = jest.fn();

    playerFindByIdUseCase = new PlayerFindByIdUseCase(
      repository,
      logger,
      exception,
    );
  });

  describe('find player by id ', () => {
    it('should throw error if occurs', async () => {
      const id = 52;
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(playerFindByIdUseCase.execute(id)).rejects.toThrow();
    });
    it('should return not found if player not found', async () => {
      const id = 1;
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(playerFindByIdUseCase.execute(id)).rejects.toThrow();
    });

    it('should return player if  found', async () => {
      const id = 52;
      (repository.findOne as jest.Mock).mockResolvedValue(player);

      await expect(playerFindByIdUseCase.execute(id)).resolves.toBeDefined();
    });
  });
});
