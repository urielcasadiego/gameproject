import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PaginateModel } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Score } from "./score.schema";
import { CreateScoresDto } from "./dto/create-score.dto";

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private scoreModel: PaginateModel<Score>
  ) {}

  async createScore(
    createScoreDto: CreateScoresDto
  ): Promise<{ data: CreateScoresDto; code: number; message: string }> {
    try {
      const date = new Date().toISOString();
      const newScore = new this.scoreModel(createScoreDto);
      const result = await newScore.save();
      const responseData: CreateScoresDto = {
        ...result.toObject(),
        createdAt: date,
        updatedAt: date,
      };
      return { data: responseData, code: 200, message: "OK" };
    } catch (error) {
      throw new InternalServerErrorException({
        code: 500,
        message: error.message || "Internal server error",
      });
    }
  }

  async deleteScore(
    scoreId: string
  ): Promise<{ code: number; message: string }> {
    try {
      const result = await this.scoreModel
        .findOneAndDelete({ scoreId: scoreId })
        .exec();
      if (!result) {
        throw new NotFoundException({ code: 400, message: "Score_not_found" });
      }
      return { code: 204, message: "Score deleted successfully" };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  async getAllScoresTop() {
    try {
      const scores = await this.scoreModel.find().sort({ score: -1 }).limit(20);
      const userIds = [...new Set(scores.map((score) => score.userId))];
      const scoresFinal = await this.matchName(userIds, scores);
      return { data: scoresFinal, code: 200, message: "OK" };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  async getAllScores(page: number, limit: number) {
    const options = {
      page,
      limit,
    };
    const scoresResult = await this.getAllScoresPaginated(options);
    const scores = Array.isArray(scoresResult.docs) ? scoresResult.docs : [];
    const userIds = [...new Set(scores.map((score) => score.userId))];
    const scoresFinal = await this.matchName(userIds, scores);
    return {
      data: scoresFinal,
      totalDocs: scoresResult.totalDocs,
      limit: scoresResult.limit,
      page: scoresResult.page,
      totalPages: scoresResult.totalPages,
      hasNextPage: scoresResult.hasNextPage,
      hasPrevPage: scoresResult.hasPrevPage,
      nextPage: scoresResult.nextPage,
      prevPage: scoresResult.prevPage,
      code: 200,
      message: "Scores retrieved successfully",
    };
  }

  getAllScoresPaginated = async (options) => {
    const { page, limit, sort } = options;
    const paginateOptions = {
      page,
      limit,
      sort: sort || { score: 1 },
    };
    return this.scoreModel.paginate({}, paginateOptions);
  };

  getTotalScoresCount = async () => {
    return await this.scoreModel.countDocuments();
  };

  async matchName(userIds, scores) {
    const base = process.env.URL_API_USERS;
    const userPromises = userIds.map((userId) =>
      fetch(`${base}/${userId}`)
        .then((response) => response.json())
        .then((data) => ({
          userId,
          name: data.name,
        }))
        .catch(() => ({
          userId,
          name: "No existe",
        }))
    );
    const userResults = await Promise.all(userPromises);
    const userMap = userResults.reduce(
      (acc, user) => {
        acc[user.userId] = user.name;
        return acc;
      },
      {} as { [key: string]: string }
    );
    const scoresFinal = scores.map((score) => {
      const userName = userMap[score.userId] || "Desconocido";
      return {
        ...score.toObject(),
        name: userName,
      };
    });
    return scoresFinal;
  }
}
