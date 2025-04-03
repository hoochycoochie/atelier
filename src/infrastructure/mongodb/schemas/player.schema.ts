import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlayerEntity } from 'core/entities/player.entity';
import { HydratedDocument } from 'mongoose';
import { Country } from './country.schema';
import { DataStats } from './data.schema';
import { Gender } from './gender.enum';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player implements PlayerEntity {
  id: number;
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;
  @Prop()
  shortname: string;
  @Prop()
  sex: Gender;
  @Prop({ type: Country })
  country: Country;
  @Prop()
  picture: string;
  @Prop({ type: DataStats })
  data: DataStats;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
