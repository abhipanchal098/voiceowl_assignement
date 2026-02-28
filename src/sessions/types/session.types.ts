export enum SessionStatus {
  Initiated = 'initiated',
  Active = 'active',
  Completed = 'completed',
  Failed = 'failed',
}

export enum EventType {
  UserSpeech = 'user_speech',
  BotSpeech = 'bot_speech',
  System = 'system',
}

export type Metadata = Record<string, unknown>;
export type EventPayload = Record<string, unknown>;
