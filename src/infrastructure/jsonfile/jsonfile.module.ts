import { Module } from '@nestjs/common';
import { PlayserJsonRepositoryService } from './playser-json-repository/playser-json-repository.service';

@Module({
  providers: [PlayserJsonRepositoryService],
  exports: [PlayserJsonRepositoryService],
})
export class JsonfileModule {}
