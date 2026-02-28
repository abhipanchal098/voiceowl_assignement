import { Model } from 'mongoose';
import { ConversationEvent, ConversationEventDocument } from '../schemas/conversation-event.schema';
export declare class EventsRepository {
    private readonly eventModel;
    constructor(eventModel: Model<ConversationEventDocument>);
    createEvent(event: Omit<ConversationEvent, 'timestamp'> & {
        timestamp: Date;
    }): Promise<ConversationEvent>;
    findBySessionIdAndEventId(sessionId: string, eventId: string): Promise<ConversationEvent | null>;
    findBySessionId(sessionId: string, limit: number, offset: number): Promise<ConversationEvent[]>;
    countBySessionId(sessionId: string): Promise<number>;
}
