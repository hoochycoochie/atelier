import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from 'infrastructure/usecases-proxy/usecases-proxy.module';
import { PlayerController } from './player/player.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [PlayerController],
})
export class ControllersModule {}
