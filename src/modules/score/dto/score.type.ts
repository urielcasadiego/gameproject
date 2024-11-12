import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class ScoreType {
  @Field()
  userId: string;

  @Field()
  scoreId: string;

  @Field()
  name: string;

  @Field()
  game: string;

  @Field(() => Int)
  score: number;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt?: string;
}
