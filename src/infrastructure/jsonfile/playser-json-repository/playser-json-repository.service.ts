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

@Injectable()
export class PlayserJsonRepositoryService implements IPlayerRepository {
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
  find({ limit }: PaginationParams): Promise<PlayerEntity[]> {
    try {
      const players = this.players.sort((p1, p2) => {
        return p1.data.rank - p2.data.rank;
      });
      if (limit > this.players.length) return Promise.resolve(players);
      return Promise.resolve(players.slice(0, limit));
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number): Promise<PlayerEntity> {
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
  async statistics(): Promise<StatisticEntity> {
    try {
      const players = this.players;
      const stats: StatisticEntity = {
        country: '',
        meanBodyMassIndex: 0,
        medianPlayerHeight: 0,
      };
      stats.medianPlayerHeight = await this.computeMedianPlayerHeight(
        players.map((p) => p.data.height),
      );
      stats.meanBodyMassIndex = await this.computeMeanBodyMassIndex(players);
      stats.country = await this.computeCountryMostWinRatio(players);

      return Promise.resolve(stats);
    } catch (error) {
      throw error;
    }
  }

  async computeMeanBodyMassIndex(players: PlayerEntity[]): Promise<number> {
    try {
      if (!players || !players.length || players.length === 0)
        throw new Error('players empty');
      const results: number[] = [];
      players.forEach(async (player) => {
        try {
          let bodyMeanIndex = 0;
          const weight = player?.data?.weight;
          const height = player?.data?.height;
          if (weight > 0 && height > 0)
            bodyMeanIndex = weight / Math.pow(height, 2);
          results.push(bodyMeanIndex);
        } catch (error) {
          throw error;
        }
      });

      return Promise.resolve(results.reduce((a, b) => a + b) / results.length);
    } catch (error) {
      throw error;
    }
  }

  async computeCountryMostWinRatio(players: PlayerEntity[]): Promise<string> {
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
          if (last) {
            last.forEach((match) => {
              if (match === 1) {
                totalWin++;
              }
              if (match === 0) {
                totalLost++;
              }
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

  computeMedianPlayerHeight(heights: number[]): Promise<number> {
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
