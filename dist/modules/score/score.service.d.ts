import { PaginateModel } from "mongoose";
import { Score } from "./score.schema";
import { CreateScoresDto } from "./dto/create-score.dto";
export declare class ScoreService {
    private scoreModel;
    constructor(scoreModel: PaginateModel<Score>);
    createScore(createScoreDto: CreateScoresDto): Promise<{
        data: CreateScoresDto;
        code: number;
        message: string;
    }>;
    deleteScore(scoreId: string): Promise<{
        code: number;
        message: string;
    }>;
    getAllScoresTop(): Promise<{
        data: any;
        code: number;
        message: string;
    }>;
    getAllScores(page: number, limit: number): Promise<{
        data: any;
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        nextPage: number;
        prevPage: number;
        code: number;
        message: string;
    }>;
    getAllScoresPaginated: (options: any) => Promise<import("mongoose").PaginateResult<import("mongoose").Document<unknown, {}, Score> & Score & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>>;
    getTotalScoresCount: () => Promise<number>;
    matchName(userIds: any, scores: any): Promise<any>;
}
