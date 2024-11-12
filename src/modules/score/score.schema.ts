import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

@Schema()
export class Score extends Document {
  @Prop({ required: true })
  scoreId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  game: string;

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);

ScoreSchema.plugin(mongoosePaginate);
