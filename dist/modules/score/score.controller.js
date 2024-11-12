"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreController = void 0;
const common_1 = require("@nestjs/common");
const create_score_dto_1 = require("./dto/create-score.dto");
const score_service_1 = require("./score.service");
const uuid_1 = require("uuid");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ScoreController = class ScoreController {
    constructor(scoresService) {
        this.scoresService = scoresService;
    }
    async createscore(createScoreDto) {
        try {
            const scoreId = (0, uuid_1.v4)();
            const createdAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();
            const result = await this.scoresService.createScore({
                ...createScoreDto,
                scoreId,
                createdAt,
                updatedAt,
            });
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                code: 500,
                message: error.message || "Error creating score",
            });
        }
    }
    async delete(scoreId) {
        return this.scoresService.deleteScore(scoreId);
    }
    async getAllScoresName(page, limit) {
        try {
            const result = await this.scoresService.getAllScores(page, limit);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                code: 500,
                message: error.message || "Error retrieving scores",
            });
        }
    }
    async getAllScoresTop() {
        try {
            return await this.scoresService.getAllScoresTop();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                code: 500,
                message: error.message || "Error retrieving scores",
            });
        }
    }
};
exports.ScoreController = ScoreController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Crear una nueva puntuación" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Puntuación creada exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error al crear la puntuación" }),
    (0, swagger_1.ApiBody)({
        description: "Crear una nueva puntuación",
        type: create_score_dto_1.CreateScoresDto,
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
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_score_dto_1.CreateScoresDto]),
    __metadata("design:returntype", Promise)
], ScoreController.prototype, "createscore", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Eliminar una puntuación por ID" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: "Score deleted successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "score not found",
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal Server Error. An unexpected error occurred.",
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("delete/:scoreId"),
    __param(0, (0, common_1.Param)("scoreId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScoreController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Obtener puntuaciones" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal Server Error. An unexpected error occurred.",
    }),
    (0, common_1.Get)("findName"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ScoreController.prototype, "getAllScoresName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Obtener las puntuaciones más altas" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Internal Server Error. An unexpected error occurred.",
    }),
    (0, common_1.Get)("top"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScoreController.prototype, "getAllScoresTop", null);
exports.ScoreController = ScoreController = __decorate([
    (0, swagger_1.ApiTags)("Scores"),
    (0, common_1.Controller)("scores"),
    __metadata("design:paramtypes", [score_service_1.ScoreService])
], ScoreController);
//# sourceMappingURL=score.controller.js.map