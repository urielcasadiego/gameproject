import { ScoreType } from "./score.type";
export declare class ScoresPagination {
    code: number;
    message: string;
    data: ScoreType[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number;
    prevPage: number;
}
