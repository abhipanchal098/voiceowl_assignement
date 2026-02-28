import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SessionStatus } from '../types/session.types';
import type { Metadata } from '../types/session.types';

@Schema({ collection: 'conversation_sessions', timestamps: false })
export class ConversationSession {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true, enum: SessionStatus, type: String })
  status: SessionStatus;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true, type: Date })
  startedAt: Date;

  @Prop({ type: Date, default: null })
  endedAt: Date | null;

  @Prop({ type: Object, default: undefined })
  metadata?: Metadata;
}

export type ConversationSessionDocument = HydratedDocument<ConversationSession>;
export const ConversationSessionSchema =
  SchemaFactory.createForClass(ConversationSession);

ConversationSessionSchema.index({ sessionId: 1 }, { unique: true });
