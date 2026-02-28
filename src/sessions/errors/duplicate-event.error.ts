export class DuplicateEventError extends Error {
  constructor(
    public readonly sessionId: string,
    public readonly eventId: string,
  ) {
    super('Duplicate event for session');
  }
}
