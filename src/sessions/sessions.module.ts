import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationEvent,
  ConversationEventSchema,
} from './schemas/conversation-event.schema';
import {
  ConversationSession,
  ConversationSessionSchema,
} from './schemas/conversation-session.schema';
import { EventsRepository } from './repositories/events.repository';
import { SessionsRepository } from './repositories/sessions.repository';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationSession.name, schema: ConversationSessionSchema },
      { name: ConversationEvent.name, schema: ConversationEventSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, EventsRepository],
})
export class SessionsModule {}
