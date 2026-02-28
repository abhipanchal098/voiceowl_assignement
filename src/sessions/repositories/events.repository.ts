import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DuplicateEventError } from '../errors/duplicate-event.error';
import {
  ConversationEvent,
  ConversationEventDocument,
} from '../schemas/conversation-event.schema';

const EVENT_PROJECTION = '-_id -__v';
const DUPLICATE_KEY_CODE = 11000;

const isDuplicateKeyError = (error: unknown): error is { code: number } => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  return (error as { code?: unknown }).code === DUPLICATE_KEY_CODE;
};

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(ConversationEvent.name)
    private readonly eventModel: Model<ConversationEventDocument>,
  ) {}

  async createEvent(
    event: Omit<ConversationEvent, 'timestamp'> & { timestamp: Date },
  ): Promise<ConversationEvent> {
    try {
      const created = await this.eventModel.create(event);
      const plain = created.toObject({
        versionKey: false,
      }) as ConversationEvent & { _id?: unknown };
      delete plain._id;
      return plain;
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new DuplicateEventError(event.sessionId, event.eventId);
      }
      throw error;
    }
  }

  async findBySessionIdAndEventId(
    sessionId: string,
    eventId: string,
  ): Promise<ConversationEvent | null> {
    return this.eventModel
      .findOne({ sessionId, eventId })
      .select(EVENT_PROJECTION)
      .lean()
      .exec();
  }

  async findBySessionId(
    sessionId: string,
    limit: number,
    offset: number,
  ): Promise<ConversationEvent[]> {
    return this.eventModel
      .find({ sessionId })
      .sort({ timestamp: 1, eventId: 1 })
      .skip(offset)
      .limit(limit)
      .select(EVENT_PROJECTION)
      .lean()
      .exec();
  }

  async countBySessionId(sessionId: string): Promise<number> {
    return this.eventModel.countDocuments({ sessionId }).exec();
  }
}
