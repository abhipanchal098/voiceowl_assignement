import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import type { Metadata } from '../types/session.types';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsOptional()
  @IsObject()
  metadata?: Metadata;
}
