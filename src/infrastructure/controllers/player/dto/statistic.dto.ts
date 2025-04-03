import { StatisticEntity } from 'core/repositories';

export class StaticticDto implements StatisticEntity {
  country: string;
  meanBodyMassIndex: number;
  medianSize: number;
}
