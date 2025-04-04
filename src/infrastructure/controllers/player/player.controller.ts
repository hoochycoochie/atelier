import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerFindByIdUseCase } from 'core/use-cases/player-findbyId.usecase';
import { PlayerListUseCase } from 'core/use-cases/player-list.usecase';
import { PlayerStatsUseCase } from 'core/use-cases/player-stats.usecase';
import { ApiResponseType } from 'infrastructure/common/swagger/response.decorator';
import { UseCaseProxy } from 'infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'infrastructure/usecases-proxy/usecases-proxy.module';

import { FindPlayersDto } from './dto/find-player-list.dto';
import { PlayerDto } from './dto/player.dto';
import { StaticticDto } from './dto/statistic.dto';

@Controller('players')
@ApiTags('players')
@ApiResponse({ status: 500, description: 'Internal error' })
export class PlayerController {
  constructor(
    @Inject(UsecasesProxyModule.PLAYER_FIND_BY_ID_PROXY)
    private readonly playerFindByIdUseCase: UseCaseProxy<PlayerFindByIdUseCase>,

    @Inject(UsecasesProxyModule.PLAYER_LIST_PROXY)
    private readonly playerListUseCase: UseCaseProxy<PlayerListUseCase>,

    @Inject(UsecasesProxyModule.PLAYER_STATS_PROXY)
    private readonly playerStatsUseCase: UseCaseProxy<PlayerStatsUseCase>,
  ) {}

  @Post()
  findAll(@Body() data: FindPlayersDto): Promise<PlayerDto[]> {
    return this.playerListUseCase.getInstance().execute(data);
  }
  @Get('statistics')
  @ApiResponseType(StaticticDto, false)
  getStatistics(): Promise<StaticticDto> {
    return this.playerStatsUseCase.getInstance().execute();
  }
  @Get(':id')
  @ApiResponseType(PlayerDto, false)
  findOne(@Param('id') id: string): Promise<PlayerDto> {
    return this.playerFindByIdUseCase.getInstance().execute(+id);
  }
}
