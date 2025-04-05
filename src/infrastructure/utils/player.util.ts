import { Injectable } from '@nestjs/common';
import {
  PlayerEntity,
  PlayerEntityWithRatioWin,
} from 'core/entities/player.entity';
import { CountryStatistic } from 'infrastructure/jsonfile/types';

@Injectable()
export class PlayerUtils {
  /**
   * This TypeScript function computes the country with the highest win ratio based on player data.
   * @param {PlayerEntity[]} players - The `computeMostWinRatioByCountry` function takes an array of
   * `PlayerEntity` objects as input. Each `PlayerEntity` object represents a player and contains
   * information such as their country code and match data.
   * @returns The `computeMostWinRatioByCountry` function returns a Promise that resolves to the country
   * with the highest win ratio among the players provided in the input array.
   */
  static async computeMostWinRatioByCountry(
    players: PlayerEntity[],
  ): Promise<string> {
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
  static async computeMedianPlayerHeight(heights: number[]): Promise<number> {
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
  static async computeMeanBodyMassIndex(
    players: PlayerEntity[],
  ): Promise<number> {
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
}
