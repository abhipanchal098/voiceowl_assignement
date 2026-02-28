import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { EventType, type EventPayload } from '../types/session.types';

export class AddEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsEnum(EventType)
  type: EventType;

  @IsObject()
  payload: EventPayload;

  @IsDateString()
  timestamp: string;
}
