import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerEntity } from 'core/entities/player.entity';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import { PlayerUtils } from '../../utils';

/* The `PlayerJsonRepositoryService` class in TypeScript implements methods to manage player data,
including finding players by rank, retrieving player statistics, and calculating BMI and win ratios. */

@Injectable()
export class PlayerJsonRepositoryService implements IPlayerRepository {
  players: PlayerEntity[] = [];
  constructor() {
    this.players = [
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
      {
        id: 65,
        firstname: 'Stan',
        lastname: 'Wawrinka',
        shortname: 'S.WAW',
        sex: 'M',
        country: {
          picture: 'https://tenisu.latelier.co/resources/Suisse.png',
          code: 'SUI',
        },
        picture: 'https://tenisu.latelier.co/resources/Wawrinka.png',
        data: {
          rank: 21,
          points: 1784,
          weight: 81000,
          height: 183,
          age: 33,
          last: [1, 1, 1, 0, 1],
        },
      },
      {
        id: 102,
        firstname: 'Serena',
        lastname: 'Williams',
        shortname: 'S.WIL',
        sex: 'F',
        country: {
          picture: 'https://tenisu.latelier.co/resources/USA.png',
          code: 'USA',
        },
        picture: 'https://tenisu.latelier.co/resources/Serena.png',
        data: {
          rank: 10,
          points: 3521,
          weight: 72000,
          height: 175,
          age: 37,
          last: [0, 1, 1, 1, 0],
        },
      },
      {
        id: 17,
        firstname: 'Rafael',
        lastname: 'Nadal',
        shortname: 'R.NAD',
        sex: 'M',
        country: {
          picture: 'https://tenisu.latelier.co/resources/Espagne.png',
          code: 'ESP',
        },
        picture: 'https://tenisu.latelier.co/resources/Nadal.png',
        data: {
          rank: 1,
          points: 1982,
          weight: 85000,
          height: 185,
          age: 33,
          last: [1, 0, 0, 0, 1],
        },
      },
    ];
  }
  /**
   * The function `find` sorts a list of players by rank and returns a subset based on a specified
   * limit.
   * @param {PaginationParams}  - The `find` method takes a `limit` parameter of type
   * `PaginationParams`, which is an object with a `limit` property specifying the maximum number of
   * items to return. The method sorts the `players` array based on the `rank` property of each player's
   * data. If the `
   * @returns The `find` method returns a Promise that resolves to an array of `PlayerEntity` objects.
   * If the specified `limit` is greater than the total number of players, it returns all players sorted
   * by rank. Otherwise, it returns a subset of players based on the specified `limit`.
   */
  async find({ limit }: PaginationParams): Promise<PlayerEntity[]> {
    try {
      const players = this.players.sort(
        (p1, p2) => p1.data.rank - p2.data.rank,
      );
      if (limit > this.players.length) return Promise.resolve(players);
      return Promise.resolve(players.slice(0, limit));
    } catch (error) {
      throw error;
    }
  }

  /**
   * This TypeScript function finds a player entity by its ID and returns a Promise with the result.
   * @param {number} id - The `id` parameter is a number representing the unique identifier of the
   * player entity that you want to find in the `players` array.
   * @returns The `findOne` method is returning a Promise that resolves to a `PlayerEntity` object.
   */
  async findOne(id: number): Promise<PlayerEntity> {
    try {
      const index = this.players.findIndex((p) => p?.id === id);
      if (index < 0)
        throw new NotFoundException(`player with id = ${id} is not found`);
      const playerFound = this.players[index];
      return Promise.resolve(playerFound);
    } catch (error) {
      throw error;
    }
  }
  /**
   * The `statistics` function in TypeScript asynchronously computes and returns statistics related to
   * player data, including median player height, mean body mass index, and the country with the most win
   * ratio.
   * @returns The `statistics()` method returns a Promise that resolves to a `StatisticEntity` object
   * containing statistical information such as country, mean body mass index, and median player height.
   */
  async statistics(): Promise<StatisticEntity> {
    try {
      const players = this.players;
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
