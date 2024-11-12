import { ScoreService } from "./score.service";
import { ScoresPagination } from "./dto/scores-pagination.dto";
export declare class ScoresResolver {
    private readonly scoresService;
    constructor(scoresService: ScoreService);
    getAllScores(page?: number, limit?: number): Promise<ScoresPagination>;
    getAllScoresTop(): Promise<{
        code: number;
        message: string;
        data: any;
    }>;
}
