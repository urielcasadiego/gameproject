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
exports.ScoresResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const apollo_server_errors_1 = require("apollo-server-errors");
const score_service_1 = require("./score.service");
const score_type_1 = require("./dto/score.type");
const scores_pagination_dto_1 = require("./dto/scores-pagination.dto");
let ScoresResolver = class ScoresResolver {
    constructor(scoresService) {
        this.scoresService = scoresService;
    }
    async getAllScores(page = 1, limit = 10) {
        try {
            const result = await this.scoresService.getAllScores(page, limit);
            const converdate = result.data.map((score) => {
                if (score.createdAt && score.createdAt instanceof Date) {
                    score.createdAt = score.createdAt.toISOString();
                }
                return score;
            });
            if (!result) {
                throw new apollo_server_errors_1.ApolloError("No scores found", "NO_SCORES_FOUND");
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
        }
        catch (error) {
            console.error(error);
            throw new apollo_server_errors_1.ApolloError(error.message || "Error retrieving scores");
        }
    }
    async getAllScoresTop() {
        try {
            const result = await this.scoresService.getAllScoresTop();
            return {
                code: 200,
                message: "List of top scores retrieved successfully",
                data: result.data,
            };
        }
        catch (error) {
            throw new Error(error.message || "Error retrieving top scores");
        }
    }
};
exports.ScoresResolver = ScoresResolver;
__decorate([
    (0, graphql_1.Query)(() => scores_pagination_dto_1.ScoresPagination, { name: "getAllScores" }),
    __param(0, (0, graphql_1.Args)("page", { type: () => graphql_1.Int, nullable: true })),
    __param(1, (0, graphql_1.Args)("limit", { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ScoresResolver.prototype, "getAllScores", null);
__decorate([
    (0, graphql_1.Query)(() => scores_pagination_dto_1.ScoresPagination, { name: "getAllScoresTop" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScoresResolver.prototype, "getAllScoresTop", null);
exports.ScoresResolver = ScoresResolver = __decorate([
    (0, graphql_1.Resolver)(() => score_type_1.ScoreType),
    __metadata("design:paramtypes", [score_service_1.ScoreService])
], ScoresResolver);
//# sourceMappingURL=score.resolver.js.map