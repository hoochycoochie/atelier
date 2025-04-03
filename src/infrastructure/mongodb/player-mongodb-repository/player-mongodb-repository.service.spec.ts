import { Test, TestingModule } from '@nestjs/testing';
import { PlayerMongodbRepositoryService } from './player-mongodb-repository.service';

describe('PlayerMongodbRepositoryService', () => {
  let service: PlayerMongodbRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerMongodbRepositoryService],
    }).compile();

    service = module.get<PlayerMongodbRepositoryService>(
      PlayerMongodbRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
