import { AddEventDto } from './dto/add-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaginationDto } from './dto/pagination.dto';
import { EventsRepository } from './repositories/events.repository';
import { SessionsRepository } from './repositories/sessions.repository';
export declare class SessionsService {
    private readonly sessionsRepository;
    private readonly eventsRepository;
    constructor(sessionsRepository: SessionsRepository, eventsRepository: EventsRepository);
    createSession(dto: CreateSessionDto): Promise<import("./schemas/conversation-session.schema").ConversationSession>;
    addEvent(sessionId: string, dto: AddEventDto): Promise<import("./schemas/conversation-event.schema").ConversationEvent>;
    getSession(sessionId: string, pagination: PaginationDto): Promise<{
        session: import("./schemas/conversation-session.schema").ConversationSession;
        events: import("./schemas/conversation-event.schema").ConversationEvent[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
        };
    }>;
    completeSession(sessionId: string): Promise<import("./schemas/conversation-session.schema").ConversationSession>;
}
