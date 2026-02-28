import { Model } from 'mongoose';
import { CreateSessionDto } from '../dto/create-session.dto';
import { ConversationSession, ConversationSessionDocument } from '../schemas/conversation-session.schema';
export declare class SessionsRepository {
    private readonly sessionModel;
    constructor(sessionModel: Model<ConversationSessionDocument>);
    upsertSession(dto: CreateSessionDto, now: Date): Promise<ConversationSession | null>;
    findBySessionId(sessionId: string): Promise<ConversationSession | null>;
    exists(sessionId: string): Promise<boolean>;
    completeSession(sessionId: string, endedAt: Date): Promise<ConversationSession | null>;
}
