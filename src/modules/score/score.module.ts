import { Module } from "@nestjs/common";
import { ScoreController } from "./score.controller";
import { ScoreService } from "./score.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Score, ScoreSchema } from "./score.schema";
import { ScoresResolver } from "./score.resolver";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
  ],
  controllers: [ScoreController],
  providers: [ScoreService, ScoresResolver],
  exports: [ScoreService],
})
export class ScoreModule {}
