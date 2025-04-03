import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DataStats {
  @Prop()
  lastName: string;
  @Prop()
  rank: number;
  @Prop()
  points: number;
  @Prop()
  weight: number;
  @Prop()
  height: number;
  @Prop()
  age: number;
  @Prop()
  last: number[];
}
