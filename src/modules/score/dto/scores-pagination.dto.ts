import { ObjectType, Field, Int } from "@nestjs/graphql";
import { ScoreType } from "./score.type";

@ObjectType()
export class ScoresPagination {
  @Field(() => Int)
  code: number;

  @Field()
  message: string;

  @Field(() => [ScoreType])
  data: ScoreType[];

  @Field(() => Int)
  totalDocs: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPrevPage: boolean;

  @Field(() => Int)
  nextPage: number;

  @Field(() => Int)
  prevPage: number;
}
