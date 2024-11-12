import { CreateScoresDto } from "./dto/create-score.dto";
import { ScoreService } from "./score.service";
export declare class ScoreController {
    private readonly scoresService;
    constructor(scoresService: ScoreService);
    createscore(createScoreDto: CreateScoresDto): Promise<{
        data: CreateScoresDto;
        code: number;
        message: string;
    }>;
    delete(scoreId: string): Promise<{
        code: number;
        message: string;
    }>;
    getAllScoresName(page: number, limit: number): Promise<{
        data: any[];
        code: number;
        message: string;
    }>;
    getAllScoresTop(): Promise<{
        data: any[];
        code: number;
        message: string;
    }>;
}
