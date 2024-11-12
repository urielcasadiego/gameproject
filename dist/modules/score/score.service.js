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
exports.ScoreService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const score_schema_1 = require("./score.schema");
let ScoreService = class ScoreService {
    constructor(scoreModel) {
        this.scoreModel = scoreModel;
        this.getAllScoresPaginated = async (options) => {
            const { page, limit, sort } = options;
            const paginateOptions = {
                page,
                limit,
                sort: sort || { score: 1 },
            };
            return this.scoreModel.paginate({}, paginateOptions);
        };
        this.getTotalScoresCount = async () => {
            return await this.scoreModel.countDocuments();
        };
    }
    async createScore(createScoreDto) {
        try {
            const date = new Date().toISOString();
            const newScore = new this.scoreModel(createScoreDto);
            const result = await newScore.save();
            const responseData = {
                ...result.toObject(),
                createdAt: date,
                updatedAt: date,
            };
            return { data: responseData, code: 200, message: "OK" };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                code: 500,
                message: error.message || "Internal server error",
            });
        }
    }
    async deleteScore(scoreId) {
        try {
            const result = await this.scoreModel
                .findOneAndDelete({ scoreId: scoreId })
                .exec();
            if (!result) {
                throw new common_1.NotFoundException({ code: 400, message: "Score_not_found" });
            }
            return { code: 204, message: "Score deleted successfully" };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException({
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException({
                data: null,
                code: 500,
                message: "Internal server error",
            });
        }
    }
    async getAllScores(page, limit) {
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
    async matchName(userIds, scores) {
        const base = process.env.URL_API_USERS;
        const userPromises = userIds.map((userId) => fetch(`${base}/${userId}`)
            .then((response) => response.json())
            .then((data) => ({
            userId,
            name: data.name,
        }))
            .catch(() => ({
            userId,
            name: "No existe",
        })));
        const userResults = await Promise.all(userPromises);
        const userMap = userResults.reduce((acc, user) => {
            acc[user.userId] = user.name;
            return acc;
        }, {});
        const scoresFinal = scores.map((score) => {
            const userName = userMap[score.userId] || "Desconocido";
            return {
                ...score.toObject(),
                name: userName,
            };
        });
        return scoresFinal;
    }
};
exports.ScoreService = ScoreService;
exports.ScoreService = ScoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(score_schema_1.Score.name)),
    __metadata("design:paramtypes", [Object])
], ScoreService);
//# sourceMappingURL=score.service.js.map