import { Document, Schema as MongooseSchema } from "mongoose";
export declare class Score extends Document {
    scoreId: string;
    userId: string;
    game: string;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ScoreSchema: MongooseSchema<Score, import("mongoose").Model<Score, any, any, any, Document<unknown, any, Score> & Score & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Score, Document<unknown, {}, import("mongoose").FlatRecord<Score>> & import("mongoose").FlatRecord<Score> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
