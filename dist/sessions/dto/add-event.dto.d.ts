import { EventType, type EventPayload } from '../types/session.types';
export declare class AddEventDto {
    eventId: string;
    type: EventType;
    payload: EventPayload;
    timestamp: string;
}
