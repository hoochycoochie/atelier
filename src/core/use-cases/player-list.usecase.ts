import { PlayerEntity } from 'core/entities/player.entity';
import { IException } from 'core/exceptions/exceptions.interface';
import { ILogger } from 'core/logger/logger.interface';
import { IPlayerRepository } from 'core/repositories';

export class PlayerListUseCase {
  constructor(
    private readonly repository: IPlayerRepository,
    private readonly logger: ILogger,
    private readonly exception: IException,
  ) {}

  async execute(): Promise<PlayerEntity[]> {
    try {
      this.logger.warn(undefined, 'trying to find players');
      const result = await this.repository.find();
      this.logger.log(undefined, 'success finding players');
      return result;
    } catch (error) {
      this.logger.error(undefined, 'error finding players');
      throw error;
    }
  }
}
