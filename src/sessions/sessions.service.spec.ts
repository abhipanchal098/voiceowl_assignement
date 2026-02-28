import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AddEventDto } from './dto/add-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { DuplicateEventError } from './errors/duplicate-event.error';
import { EventsRepository } from './repositories/events.repository';
import { SessionsRepository } from './repositories/sessions.repository';
import { SessionsService } from './sessions.service';
import { EventType, SessionStatus } from './types/session.types';

const baseSession = {
  sessionId: 'sess-1',
  status: SessionStatus.Initiated,
  language: 'en',
  startedAt: new Date('2025-01-01T00:00:00.000Z'),
  endedAt: null,
};

describe('SessionsService', () => {
  let service: SessionsService;
  let sessionsRepository: SessionsRepository;
  let eventsRepository: EventsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: SessionsRepository,
          useValue: {
            upsertSession: jest.fn(),
            exists: jest.fn(),
            findBySessionId: jest.fn(),
            completeSession: jest.fn(),
          },
        },
        {
          provide: EventsRepository,
          useValue: {
            createEvent: jest.fn(),
            findBySessionIdAndEventId: jest.fn(),
            findBySessionId: jest.fn(),
            countBySessionId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(SessionsService);
    sessionsRepository = moduleRef.get(SessionsRepository);
    eventsRepository = moduleRef.get(EventsRepository);
  });

  it('creates or returns a session idempotently', async () => {
    const dto: CreateSessionDto = {
      sessionId: 'sess-1',
      language: 'en',
    };

    const upsertSessionSpy = jest
      .spyOn(sessionsRepository, 'upsertSession')
      .mockResolvedValue(baseSession);

    const result = await service.createSession(dto);

    expect(result).toEqual(baseSession);
    expect(upsertSessionSpy).toHaveBeenCalledWith(dto, expect.any(Date));
  });

  it('rejects event creation when session is missing', async () => {
    const dto: AddEventDto = {
      eventId: 'evt-1',
      type: EventType.System,
      payload: { source: 'test' },
      timestamp: new Date().toISOString(),
    };

    jest.spyOn(sessionsRepository, 'exists').mockResolvedValue(false);

    await expect(service.addEvent('missing', dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns existing event on duplicate insert', async () => {
    const dto: AddEventDto = {
      eventId: 'evt-1',
      type: EventType.UserSpeech,
      payload: { text: 'hello' },
      timestamp: new Date().toISOString(),
    };

    jest.spyOn(sessionsRepository, 'exists').mockResolvedValue(true);
    jest
      .spyOn(eventsRepository, 'createEvent')
      .mockRejectedValue(new DuplicateEventError('sess-1', 'evt-1'));
    jest
      .spyOn(eventsRepository, 'findBySessionIdAndEventId')
      .mockResolvedValue({
        sessionId: 'sess-1',
        eventId: 'evt-1',
        type: EventType.UserSpeech,
        payload: { text: 'hello' },
        timestamp: new Date('2025-01-02T00:00:00.000Z'),
      });

    const result = await service.addEvent('sess-1', dto);

    expect(result).toMatchObject({ eventId: 'evt-1', sessionId: 'sess-1' });
  });

  it('throws conflict if duplicate event lookup fails', async () => {
    const dto: AddEventDto = {
      eventId: 'evt-2',
      type: EventType.BotSpeech,
      payload: { text: 'hi' },
      timestamp: new Date().toISOString(),
    };

    jest.spyOn(sessionsRepository, 'exists').mockResolvedValue(true);
    jest
      .spyOn(eventsRepository, 'createEvent')
      .mockRejectedValue(new DuplicateEventError('sess-1', 'evt-2'));
    jest
      .spyOn(eventsRepository, 'findBySessionIdAndEventId')
      .mockResolvedValue(null);

    await expect(service.addEvent('sess-1', dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('returns existing session when already completed', async () => {
    const completedSession = {
      ...baseSession,
      status: SessionStatus.Completed,
      endedAt: new Date('2025-01-03T00:00:00.000Z'),
    };

    jest.spyOn(sessionsRepository, 'completeSession').mockResolvedValue(null);
    jest
      .spyOn(sessionsRepository, 'findBySessionId')
      .mockResolvedValue(completedSession);

    const result = await service.completeSession('sess-1');

    expect(result.status).toBe(SessionStatus.Completed);
  });
});
