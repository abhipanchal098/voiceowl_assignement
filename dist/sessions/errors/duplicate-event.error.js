"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateEventError = void 0;
class DuplicateEventError extends Error {
    sessionId;
    eventId;
    constructor(sessionId, eventId) {
        super('Duplicate event for session');
        this.sessionId = sessionId;
        this.eventId = eventId;
    }
}
exports.DuplicateEventError = DuplicateEventError;
//# sourceMappingURL=duplicate-event.error.js.map