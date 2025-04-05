import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerEntity } from 'core/entities/player.entity';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import { Model } from 'mongoose';
import { PlayerUtils } from '../../utils';
import { Player } from '../schemas';

@Injectable()
export class PlayerMongodbRepositoryService implements IPlayerRepository {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}
  /**
   * This TypeScript function asynchronously finds player entities with optional pagination parameters.
   * @param {PaginationParams}  - It looks like the `find` method is a function that retrieves a list of
   * players with optional pagination parameters. The `limit` parameter specifies the maximum number of
   * players to return in the result set.
   * @returns The `find` method is returning a Promise that resolves to an array of `PlayerEntity`
   * objects.
   */
  async find({ limit }: PaginationParams): Promise<PlayerEntity[]> {
    try {
      const players = await this.playerModel
        .find()
        .limit(limit || 10)
        .sort('data.rank');
      return Promise.resolve(players);
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function findOne asynchronously retrieves a player entity by its ID and throws a
   * NotFoundException if the player is not found.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
   * player entity. It is used to query the database and find a specific player with the corresponding
   * ID.
   * @returns The `findOne` method is returning a Promise that resolves to a `PlayerEntity` object. If
   * the player with the specified `id` is not found, a `NotFoundException` is thrown with a message
   * indicating that the player is not found.
   */
  async findOne(id: number): Promise<PlayerEntity> {
    try {
      const player = await this.playerModel.findById(id);
      if (!player)
        throw new NotFoundException(`player with id = ${id} is not found`);

      return Promise.resolve(player);
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function "statistics" retrieves player data, computes statistics such as median player height
   * and mean body mass index, and returns a StatisticEntity object.
   * @returns The `statistics()` function returns a Promise that resolves to a `StatisticEntity` object
   * containing statistical data such as country, mean body mass index, and median player height.
   */
  async statistics(): Promise<StatisticEntity> {
    try {
      const players = await this.playerModel.find();
      const stats: StatisticEntity = {
        country: '',
        meanBodyMassIndex: 0,
        medianPlayerHeight: 0,
      };

      const [medianPlayerHeight, meanBodyMassIndex, country] =
        await Promise.all([
          PlayerUtils.computeMedianPlayerHeight(
            players.map((p) => p.data.height),
          ),
          PlayerUtils.computeMeanBodyMassIndex(players),
          PlayerUtils.computeMostWinRatioByCountry(players),
        ]);
      stats.medianPlayerHeight = medianPlayerHeight;
      stats.meanBodyMassIndex = meanBodyMassIndex;
      stats.country = country;

      return Promise.resolve(stats);
    } catch (error) {
      throw error;
    }
  }
}
