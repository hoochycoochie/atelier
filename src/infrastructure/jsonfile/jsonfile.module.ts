import { Module } from '@nestjs/common';
import { PlayerUtils } from 'infrastructure/utils';
import { PlayerJsonRepositoryService } from './playser-json-repository/playser-json-repository.service';

@Module({
  providers: [PlayerJsonRepositoryService, PlayerUtils],
  exports: [PlayerJsonRepositoryService],
})
export class JsonfileModule {}
