import { HydratedDocument } from 'mongoose';
import { SessionStatus } from '../types/session.types';
import type { Metadata } from '../types/session.types';
export declare class ConversationSession {
    sessionId: string;
    status: SessionStatus;
    language: string;
    startedAt: Date;
    endedAt: Date | null;
    metadata?: Metadata;
}
export type ConversationSessionDocument = HydratedDocument<ConversationSession>;
export declare const ConversationSessionSchema: import("mongoose").Schema<ConversationSession, import("mongoose").Model<ConversationSession, any, any, any, import("mongoose").Document<unknown, any, ConversationSession, any, {}> & ConversationSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConversationSession, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ConversationSession>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ConversationSession> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
