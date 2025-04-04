import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerEntity } from 'core/entities/player.entity';
import { PlayerJsonRepositoryService } from './playser-json-repository.service';

describe('PlayerJsonRepositoryService', () => {
  let service: PlayerJsonRepositoryService;
  const players: PlayerEntity[] = [
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
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerJsonRepositoryService],
    }).compile();

    service = module.get<PlayerJsonRepositoryService>(
      PlayerJsonRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne player', () => {
    it('should throw not found if player not found', async () => {
      expect(async () => {
        await service.findOne(12222222222222222);
      }).rejects.toThrow(NotFoundException);
    });

    it('should found right user', async () => {
      const firstPlayerId = players[0].id;
      const player = await expect(service.findOne(firstPlayerId));
      expect(player).toBeDefined();
    });
  });

  describe('find players', () => {
    it('should return players order by rank asc', async () => {
      const users = await service.find({ limit: 2 });
      expect(users.length).toEqual(2);
      expect(users[0].data.rank).toBeLessThanOrEqual(users[1].data.rank);
    });
  });

  describe('statistics ,BodyMassIndex,WinRation,by country', () => {
    it('should return players order by rank asc', async () => {
      const { country, meanBodyMassIndex, medianPlayerHeight } =
        await service.statistics();
      expect(country).toBeDefined();
      expect(meanBodyMassIndex).toBeDefined();
      expect(medianPlayerHeight).toBeDefined();
    });
  });
});
