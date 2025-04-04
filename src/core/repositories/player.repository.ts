import { PlayerEntity } from 'core/entities/player.entity';

export interface StatisticEntity {
  country: string;
  meanBodyMassIndex: number;
  medianPlayerHeight: number;
}

export type Pagination<T> = {
  data: T[];
};
export type PaginationParams = {
  limit?: number;
};
export interface IPlayerRepository {
  find(arg: PaginationParams): Promise<PlayerEntity[]>;
  findOne(id: number): Promise<PlayerEntity>;
  statistics(): Promise<StatisticEntity>;
}
