import { IException } from 'core/exceptions/exceptions.interface';
import { ILogger } from 'core/logger/logger.interface';
import { IPlayerRepository, StatisticEntity } from 'core/repositories';

export class PlayerStatsUseCase {
  constructor(
    private readonly repository: IPlayerRepository,
    private readonly logger: ILogger,
    private readonly exception: IException,
  ) {}

  async execute(): Promise<StatisticEntity> {
    try {
      this.logger.warn(undefined, 'trying to find statics');
      const result = await this.repository.statistics();
      this.logger.log(undefined, 'success finding statictics');
      return result;
    } catch (error) {
      this.logger.error(undefined, 'error finding statictics');
      throw error;
    }
  }
}
