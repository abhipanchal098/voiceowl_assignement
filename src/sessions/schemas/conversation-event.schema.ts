import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventType } from '../types/session.types';
import type { EventPayload } from '../types/session.types';

@Schema({ collection: 'conversation_events', timestamps: false })
export class ConversationEvent {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true, enum: EventType, type: String })
  type: EventType;

  @Prop({ type: Object, required: true })
  payload: EventPayload;

  @Prop({ required: true })
  timestamp: Date;
}

export type ConversationEventDocument = HydratedDocument<ConversationEvent>;
export const ConversationEventSchema =
  SchemaFactory.createForClass(ConversationEvent);

ConversationEventSchema.index({ sessionId: 1, eventId: 1 }, { unique: true });
ConversationEventSchema.index({ sessionId: 1, timestamp: 1, eventId: 1 });
