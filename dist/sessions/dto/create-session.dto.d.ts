import type { Metadata } from '../types/session.types';
export declare class CreateSessionDto {
    sessionId: string;
    language: string;
    metadata?: Metadata;
}
