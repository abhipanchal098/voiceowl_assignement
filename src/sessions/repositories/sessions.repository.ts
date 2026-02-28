import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from '../dto/create-session.dto';
import {
  ConversationSession,
  ConversationSessionDocument,
} from '../schemas/conversation-session.schema';
import { SessionStatus } from '../types/session.types';

const SESSION_PROJECTION = '-_id -__v';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(ConversationSession.name)
    private readonly sessionModel: Model<ConversationSessionDocument>,
  ) {}

  async upsertSession(
    dto: CreateSessionDto,
    now: Date,
  ): Promise<ConversationSession | null> {
    const update = {
      $setOnInsert: {
        sessionId: dto.sessionId,
        status: SessionStatus.Initiated,
        language: dto.language,
        metadata: dto.metadata,
        startedAt: now,
        endedAt: null,
      },
    };

    return this.sessionModel
      .findOneAndUpdate({ sessionId: dto.sessionId }, update, {
        upsert: true,
        new: true,
      })
      .select(SESSION_PROJECTION)
      .lean()
      .exec();
  }

  async findBySessionId(
    sessionId: string,
  ): Promise<ConversationSession | null> {
    return this.sessionModel
      .findOne({ sessionId })
      .select(SESSION_PROJECTION)
      .lean()
      .exec();
  }

  async exists(sessionId: string): Promise<boolean> {
    const existing = await this.sessionModel.exists({ sessionId });
    return Boolean(existing);
  }

  async completeSession(
    sessionId: string,
    endedAt: Date,
  ): Promise<ConversationSession | null> {
    return this.sessionModel
      .findOneAndUpdate(
        { sessionId, status: { $ne: SessionStatus.Completed } },
        { $set: { status: SessionStatus.Completed, endedAt } },
        { new: true },
      )
      .select(SESSION_PROJECTION)
      .lean()
      .exec();
  }
}
