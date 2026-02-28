"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.SessionStatus = void 0;
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["Initiated"] = "initiated";
    SessionStatus["Active"] = "active";
    SessionStatus["Completed"] = "completed";
    SessionStatus["Failed"] = "failed";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
var EventType;
(function (EventType) {
    EventType["UserSpeech"] = "user_speech";
    EventType["BotSpeech"] = "bot_speech";
    EventType["System"] = "system";
})(EventType || (exports.EventType = EventType = {}));
//# sourceMappingURL=session.types.js.map