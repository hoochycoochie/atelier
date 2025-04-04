import { Module } from '@nestjs/common';
import { PlayerJsonRepositoryService } from './playser-json-repository/playser-json-repository.service';

@Module({
  providers: [PlayerJsonRepositoryService],
  exports: [PlayerJsonRepositoryService],
})
export class JsonfileModule {}
