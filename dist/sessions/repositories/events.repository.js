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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const duplicate_event_error_1 = require("../errors/duplicate-event.error");
const conversation_event_schema_1 = require("../schemas/conversation-event.schema");
const EVENT_PROJECTION = '-_id -__v';
const DUPLICATE_KEY_CODE = 11000;
const isDuplicateKeyError = (error) => {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return false;
    }
    return error.code === DUPLICATE_KEY_CODE;
};
let EventsRepository = class EventsRepository {
    eventModel;
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async createEvent(event) {
        try {
            const created = await this.eventModel.create(event);
            const plain = created.toObject({
                versionKey: false,
            });
            delete plain._id;
            return plain;
        }
        catch (error) {
            if (isDuplicateKeyError(error)) {
                throw new duplicate_event_error_1.DuplicateEventError(event.sessionId, event.eventId);
            }
            throw error;
        }
    }
    async findBySessionIdAndEventId(sessionId, eventId) {
        return this.eventModel
            .findOne({ sessionId, eventId })
            .select(EVENT_PROJECTION)
            .lean()
            .exec();
    }
    async findBySessionId(sessionId, limit, offset) {
        return this.eventModel
            .find({ sessionId })
            .sort({ timestamp: 1, eventId: 1 })
            .skip(offset)
            .limit(limit)
            .select(EVENT_PROJECTION)
            .lean()
            .exec();
    }
    async countBySessionId(sessionId) {
        return this.eventModel.countDocuments({ sessionId }).exec();
    }
};
exports.EventsRepository = EventsRepository;
exports.EventsRepository = EventsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_event_schema_1.ConversationEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EventsRepository);
//# sourceMappingURL=events.repository.js.map