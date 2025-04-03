import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerMongodbRepositoryService } from './player-mongodb-repository/player-mongodb-repository.service';
import { Player, PlayerSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [PlayerMongodbRepositoryService],
  exports: [PlayerMongodbRepositoryService],
})
export class MongodbModule {}
