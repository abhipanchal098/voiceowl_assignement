import { HydratedDocument } from 'mongoose';
import { EventType } from '../types/session.types';
import type { EventPayload } from '../types/session.types';
export declare class ConversationEvent {
    sessionId: string;
    eventId: string;
    type: EventType;
    payload: EventPayload;
    timestamp: Date;
}
export type ConversationEventDocument = HydratedDocument<ConversationEvent>;
export declare const ConversationEventSchema: import("mongoose").Schema<ConversationEvent, import("mongoose").Model<ConversationEvent, any, any, any, import("mongoose").Document<unknown, any, ConversationEvent, any, {}> & ConversationEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConversationEvent, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ConversationEvent>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ConversationEvent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
