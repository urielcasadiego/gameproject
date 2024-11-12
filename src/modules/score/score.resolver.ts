import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { ApolloError } from "apollo-server-errors";
import { ScoreService } from "./score.service";
import { ScoreType } from "./dto/score.type";
import { ScoresPagination } from "./dto/scores-pagination.dto"; // Asegúrate de tener este DTO adecuado

@Resolver(() => ScoreType)
export class ScoresResolver {
  constructor(private readonly scoresService: ScoreService) {}

  @Query(() => ScoresPagination, { name: "getAllScores" })
  async getAllScores(
    @Args("page", { type: () => Int, nullable: true }) page: number = 1,
    @Args("limit", { type: () => Int, nullable: true }) limit: number = 10
  ): Promise<ScoresPagination> {
    try {
      const result = await this.scoresService.getAllScores(page, limit);
      const converdate = result.data.map((score) => {
        if (score.createdAt && score.createdAt instanceof Date) {
          score.createdAt = score.createdAt.toISOString();
        }
        return score;
      });
      if (!result) {
        throw new ApolloError("No scores found", "NO_SCORES_FOUND");
      }
      const totalPages = Math.ceil(result.totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : totalPages;
      const prevPage = hasPrevPage ? page - 1 : 1;

      return {
        code: 200,
        message: "List of scores retrieved successfully",
        data: converdate,
        totalDocs: result.totalDocs,
        totalPages,
        page,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      };
    } catch (error) {
      console.error(error);
      throw new ApolloError(error.message || "Error retrieving scores");
    }
  }

  @Query(() => ScoresPagination, { name: "getAllScoresTop" })
  async getAllScoresTop() {
    try {
      const result = await this.scoresService.getAllScoresTop();
      return {
        code: 200,
        message: "List of top scores retrieved successfully",
        data: result.data,
      };
    } catch (error) {
      throw new Error(error.message || "Error retrieving top scores");
    }
  }
}
