import { PlayerEntity } from 'core/entities/player.entity';
import { IException } from 'core/exceptions/exceptions.interface';
import { ILogger } from 'core/logger/logger.interface';
import { IPlayerRepository } from 'core/repositories';

export class PlayerFindByIdUseCase {
  constructor(
    private readonly repository: IPlayerRepository,
    private readonly logger: ILogger,
    private readonly exception: IException,
  ) {}

  async execute(id: number): Promise<PlayerEntity> {
    try {
      this.logger.log(undefined, `trying to find player with id = ${id}`);
      const player = await this.repository.findOne(id);
      if (!player || !player?.id) {
        this.logger.error(undefined, `player with id = ${id} not found `);
        throw new Error(`player with id = ${id} is not found`);
      }

      this.logger.log(undefined, `player with id = ${id} found successfully`);
      return player;
    } catch (error) {
      this.logger.error(
        undefined,
        `error trying to find player with id = ${id} error = ${error.message}`,
      );
      throw error;
    }
  }
}
