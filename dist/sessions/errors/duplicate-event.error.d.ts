export declare class DuplicateEventError extends Error {
    readonly sessionId: string;
    readonly eventId: string;
    constructor(sessionId: string, eventId: string);
}
