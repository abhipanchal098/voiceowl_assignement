import { AddEventDto } from './dto/add-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
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
