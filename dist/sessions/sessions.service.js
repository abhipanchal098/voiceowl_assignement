"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_event_error_1 = require("./errors/duplicate-event.error");
const events_repository_1 = require("./repositories/events.repository");
const sessions_repository_1 = require("./repositories/sessions.repository");
let SessionsService = class SessionsService {
    sessionsRepository;
    eventsRepository;
    constructor(sessionsRepository, eventsRepository) {
        this.sessionsRepository = sessionsRepository;
        this.eventsRepository = eventsRepository;
    }
    async createSession(dto) {
        const now = new Date();
        const session = await this.sessionsRepository.upsertSession(dto, now);
        if (!session) {
            throw new common_1.InternalServerErrorException('Failed to upsert session');
        }
        return session;
    }
    async addEvent(sessionId, dto) {
        const exists = await this.sessionsRepository.exists(sessionId);
        if (!exists) {
            throw new common_1.NotFoundException('Session not found');
        }
        const event = {
            sessionId,
            eventId: dto.eventId,
            type: dto.type,
            payload: dto.payload,
            timestamp: new Date(dto.timestamp),
        };
        try {
            return await this.eventsRepository.createEvent(event);
        }
        catch (error) {
            if (error instanceof duplicate_event_error_1.DuplicateEventError) {
                const existing = await this.eventsRepository.findBySessionIdAndEventId(sessionId, dto.eventId);
                if (existing) {
                    return existing;
                }
                throw new common_1.ConflictException('Duplicate event');
            }
            throw error;
        }
    }
    async getSession(sessionId, pagination) {
        const session = await this.sessionsRepository.findBySessionId(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        const limit = pagination.limit ?? 20;
        const offset = pagination.offset ?? 0;
        const [events, total] = await Promise.all([
            this.eventsRepository.findBySessionId(sessionId, limit, offset),
            this.eventsRepository.countBySessionId(sessionId),
        ]);
        return {
            session,
            events,
            pagination: {
                limit,
                offset,
                total,
            },
        };
    }
    async completeSession(sessionId) {
        const endedAt = new Date();
        const updated = await this.sessionsRepository.completeSession(sessionId, endedAt);
        if (updated) {
            return updated;
        }
        const existing = await this.sessionsRepository.findBySessionId(sessionId);
        if (!existing) {
            throw new common_1.NotFoundException('Session not found');
        }
        return existing;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sessions_repository_1.SessionsRepository,
        events_repository_1.EventsRepository])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map