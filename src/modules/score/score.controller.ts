import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";
import { CreateScoresDto } from "./dto/create-score.dto";
import { ScoreService } from "./score.service";
import { v4 as uuidv4 } from "uuid";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Scores")
@Controller("scores")
export class ScoreController {
  constructor(private readonly scoresService: ScoreService) {}

  @ApiOperation({ summary: "Crear una nueva puntuación" })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: "Puntuación creada exitosamente" })
  @ApiResponse({ status: 500, description: "Error al crear la puntuación" })
  @ApiBody({
    description: "Crear una nueva puntuación",
    type: CreateScoresDto,
    examples: {
      example1: {
        summary: "Ejemplo de creación",
        value: {
          userId: "usuarioprueba",
          game: "Snake Game",
          email: "usuario@gmail.com",
          score: 2233,
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post("create")
  async createscore(
    @Body() createScoreDto: CreateScoresDto
  ): Promise<{ data: CreateScoresDto; code: number; message: string }> {
    try {
      const scoreId = uuidv4();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const result = await this.scoresService.createScore({
        ...createScoreDto,
        scoreId,
        createdAt,
        updatedAt,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        code: 500,
        message: error.message || "Error creating score",
      });
    }
  }

  @ApiOperation({ summary: "Eliminar una puntuación por ID" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: "Score deleted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "score not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error. An unexpected error occurred.",
  })
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:scoreId")
  async delete(
    @Param("scoreId") scoreId: string
  ): Promise<{ code: number; message: string }> {
    return this.scoresService.deleteScore(scoreId);
  }

  @ApiOperation({ summary: "Obtener puntuaciones" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "List of scores retrieved successfully.",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        description: {
          type: "string",
          example: "List of users retrieved successfully.",
        },
        totalPages: { type: "number", example: 10 },
        page: { type: "number", example: 1 },
        hasNextPage: { type: "number", example: 1 },
        hasPrevPage: { type: "number", example: 1 },
        nextPage: { type: "number", example: 1 },
        prevPage: { type: "number", example: 1 },
        limit: { type: "number", example: 1 },
        totalDocs: { type: "number", example: 14 },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userId: { type: "string", example: "ads234-234-asddas-23423" },
              scoreId: { type: "string", example: "sdsd33-677-ddsss-33322" },
              name: { type: "string", example: "Jugador Juan" },
              gane: { type: "string", example: "Take Game" },
              score: { type: "number", example: 48 },
              createdAt: { type: "string", example: "01/01/2024" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error. An unexpected error occurred.",
  })
  @Get("findName")
  async getAllScoresName(
    @Query("page") page: number,
    @Query("limit") limit: number
  ): Promise<{ data: any[]; code: number; message: string }> {
    try {
      const result = await this.scoresService.getAllScores(page, limit);
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        code: 500,
        message: error.message || "Error retrieving scores",
      });
    }
  }

  @ApiOperation({ summary: "Obtener las puntuaciones más altas" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "List of scores retrieved successfully.",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        description: {
          type: "string",
          example: "List of users retrieved successfully.",
        },
        totalPages: { type: "number", example: 10 },
        page: { type: "number", example: 1 },
        hasNextPage: { type: "number", example: 1 },
        hasPrevPage: { type: "number", example: 1 },
        nextPage: { type: "number", example: 1 },
        prevPage: { type: "number", example: 1 },
        limit: { type: "number", example: 1 },
        totalDocs: { type: "number", example: 14 },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userId: { type: "string", example: "ads234-234-asddas-23423" },
              scoreId: { type: "string", example: "sdsd33-677-ddsss-33322" },
              name: { type: "string", example: "Jugador Juan" },
              gane: { type: "string", example: "Take Game" },
              score: { type: "number", example: 48 },
              createdAt: { type: "string", example: "01/01/2024" },
              updatedAt: { type: "string", example: "01/01/2024" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error. An unexpected error occurred.",
  })
  @Get("top")
  async getAllScoresTop(): Promise<{
    data: any[];
    code: number;
    message: string;
  }> {
    try {
      return await this.scoresService.getAllScoresTop();
    } catch (error) {
      throw new InternalServerErrorException({
        code: 500,
        message: error.message || "Error retrieving scores",
      });
    }
  }
}
