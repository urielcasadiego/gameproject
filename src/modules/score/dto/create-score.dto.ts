import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateScoresDto {
  @IsNotEmpty()
  @IsString()
  scoreId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  game: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsString()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  updatedAt: string;
}
