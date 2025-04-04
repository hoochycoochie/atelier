import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerEntity } from 'core/entities/player.entity';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import { Model } from 'mongoose';
import { Player } from '../schemas';

@Injectable()
export class PlayerMongodbRepositoryService implements IPlayerRepository {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}
  find(arg: PaginationParams): Promise<PlayerEntity[]> {
    console.log('arg', arg);
    throw new Error('Method not implemented.');
  }

  async findOne(id: number): Promise<PlayerEntity> {
    console.log(id);
    throw new Error('Method not implemented.');
  }
  async statistics(): Promise<StatisticEntity> {
    throw new Error('Method not implemented.');
  }
}
