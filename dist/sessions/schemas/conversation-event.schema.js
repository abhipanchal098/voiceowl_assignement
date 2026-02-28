"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationEventSchema = exports.ConversationEvent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const session_types_1 = require("../types/session.types");
let ConversationEvent = class ConversationEvent {
    sessionId;
    eventId;
    type;
    payload;
    timestamp;
};
exports.ConversationEvent = ConversationEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], ConversationEvent.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConversationEvent.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: session_types_1.EventType, type: String }),
    __metadata("design:type", String)
], ConversationEvent.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ConversationEvent.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ConversationEvent.prototype, "timestamp", void 0);
exports.ConversationEvent = ConversationEvent = __decorate([
    (0, mongoose_1.Schema)({ collection: 'conversation_events', timestamps: false })
], ConversationEvent);
exports.ConversationEventSchema = mongoose_1.SchemaFactory.createForClass(ConversationEvent);
exports.ConversationEventSchema.index({ sessionId: 1, eventId: 1 }, { unique: true });
exports.ConversationEventSchema.index({ sessionId: 1, timestamp: 1, eventId: 1 });
//# sourceMappingURL=conversation-event.schema.js.map