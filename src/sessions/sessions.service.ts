import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddEventDto } from './dto/add-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaginationDto } from './dto/pagination.dto';
import { DuplicateEventError } from './errors/duplicate-event.error';
import { EventsRepository } from './repositories/events.repository';
import { SessionsRepository } from './repositories/sessions.repository';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async createSession(dto: CreateSessionDto) {
    const now = new Date();
    const session = await this.sessionsRepository.upsertSession(dto, now);
    if (!session) {
      throw new InternalServerErrorException('Failed to upsert session');
    }
    return session;
  }

  async addEvent(sessionId: string, dto: AddEventDto) {
    const exists = await this.sessionsRepository.exists(sessionId);
    if (!exists) {
      throw new NotFoundException('Session not found');
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
    } catch (error) {
      if (error instanceof DuplicateEventError) {
        const existing = await this.eventsRepository.findBySessionIdAndEventId(
          sessionId,
          dto.eventId,
        );
        if (existing) {
          return existing;
        }
        throw new ConflictException('Duplicate event');
      }
      throw error;
    }
  }

  async getSession(sessionId: string, pagination: PaginationDto) {
    const session = await this.sessionsRepository.findBySessionId(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
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

  async completeSession(sessionId: string) {
    const endedAt = new Date();
    const updated = await this.sessionsRepository.completeSession(
      sessionId,
      endedAt,
    );

    if (updated) {
      return updated;
    }

    const existing = await this.sessionsRepository.findBySessionId(sessionId);
    if (!existing) {
      throw new NotFoundException('Session not found');
    }

    return existing;
  }
}
