import { IsString, IsNumber, IsDate, IsOptional } from "class-validator";

export class UpdateScoresDto {
  @IsOptional()
  @IsString()
  scoreId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  game?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
