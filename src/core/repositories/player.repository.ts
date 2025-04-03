import { PlayerEntity } from 'core/entities/player.entity';

export interface StatisticEntity {
  country: string;
  meanBodyMassIndex: number;
  medianSize: number;
}
export interface IPlayerRepository {
  find(): Promise<PlayerEntity[]>;
  findOne(id: number): Promise<PlayerEntity>;
  statistics(): Promise<StatisticEntity>;
}
