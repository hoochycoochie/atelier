import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Country {
  @Prop()
  picture: string;
  @Prop()
  code: string;
}
