import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PlayerEntity,
  PlayerEntityWithRatioWin,
} from 'core/entities/player.entity';
import {
  IPlayerRepository,
  PaginationParams,
  StatisticEntity,
} from 'core/repositories';
import { CountryStatistic } from '../types';
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
          this.computeMedianPlayerHeight(players.map((p) => p.data.height)),
          this.computeMeanBodyMassIndex(players),
          this.computeMostWinRatioByCountry(players),
        ]);
      stats.medianPlayerHeight = medianPlayerHeight;
      stats.meanBodyMassIndex = meanBodyMassIndex;
      stats.country = country;

      return Promise.resolve(stats);
    } catch (error) {
      throw error;
    }
  }

  /**
   * This TypeScript function calculates the mean Body Mass Index (BMI) of a group of players based on
   * their weight and height data.
   * @param {PlayerEntity[]} players - The `computeMeanBodyMassIndex` function calculates the mean Body
   * Mass Index (BMI) of a list of players. The function takes an array of `PlayerEntity` objects as
   * input, where each `PlayerEntity` object contains data about the player's weight and height.
   * @returns The `computeMeanBodyMassIndex` function is returning a Promise that resolves to a number,
   * which represents the mean Body Mass Index (BMI) calculated from the weight and height data of the
   * players provided in the `players` array.
   */
  async computeMeanBodyMassIndex(players: PlayerEntity[]): Promise<number> {
    try {
      if (!players || !players.length || players.length === 0)
        throw new Error('players empty');
      const results: number[] = [];
      players.forEach(async (player) => {
        try {
          let bodyMeanIndexByPlayer = 0;
          const weight = player?.data?.weight;
          const height = player?.data?.height;
          if (weight > 0 && height > 0)
            bodyMeanIndexByPlayer = weight / Math.pow(height, 2);
          results.push(bodyMeanIndexByPlayer);
        } catch (error) {
          throw error;
        }
      });

      return Promise.resolve(results.reduce((a, b) => a + b) / results.length);
    } catch (error) {
      throw error;
    }
  }

  /**
   * This TypeScript function computes the country with the highest win ratio based on player data.
   * @param {PlayerEntity[]} players - The `computeMostWinRatioByCountry` function takes an array of
   * `PlayerEntity` objects as input. Each `PlayerEntity` object represents a player and contains
   * information such as their country code and match data.
   * @returns The `computeMostWinRatioByCountry` function returns a Promise that resolves to the country
   * with the highest win ratio among the players provided in the input array.
   */
  async computeMostWinRatioByCountry(players: PlayerEntity[]): Promise<string> {
    try {
      if (!players || !players.length) throw new Error('players empty');
      const playerEntityWithRatioWins: PlayerEntityWithRatioWin[] = players;

      const playersGroupedByCountry = Object.groupBy(
        playerEntityWithRatioWins,
        (player) => player.country.code,
      );

      const countryStatistics: CountryStatistic[] = [];
      for (const country in playersGroupedByCountry) {
        const countryStatistic: CountryStatistic = {
          country,
          totalLost: 0,
          totalWin: 0,
          winRatio: 0,
        };
        let totalLost = 0;
        let totalWin = 0;
        for (const player of playersGroupedByCountry[
          country
        ] as Array<PlayerEntity>) {
          const last = player?.data?.last;
          if (last && last.length > 0) {
            last.forEach((match) => {
              if (match === 1) totalWin++;
              if (match === 0) totalLost++;
            });
          }
        }
        countryStatistic.totalWin = totalWin;
        countryStatistic.totalLost = totalLost;
        countryStatistic.winRatio =
          (totalWin - totalLost) / (totalWin + totalLost);
        countryStatistics.push(countryStatistic);
      }
      const country = countryStatistics.sort(
        (a, b) => b.winRatio - a.winRatio,
      )[0].country;
      return Promise.resolve(country);
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function `computeMedianPlayerHeight` calculates the median height from an array of player
   * heights in TypeScript asynchronously.
   * @param {number[]} heights - The `computeMedianPlayerHeight` function you provided calculates the
   * median height from an array of player heights. The function takes an array of numbers representing
   * player heights as input.
   * @returns The `computeMedianPlayerHeight` function returns a Promise that resolves to the median
   * height of the players in the `heights` array.
   */
  async computeMedianPlayerHeight(heights: number[]): Promise<number> {
    try {
      if (!heights || !heights.length || heights.length === 0)
        throw new Error('heights empty');
      const mid = Math.floor(heights.length / 2);
      const nums = [...heights].sort((a, b) => a - b);
      const median =
        heights.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

      return Promise.resolve(median);
    } catch (error) {
      throw error;
    }
  }
}
