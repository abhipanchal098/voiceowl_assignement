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
exports.SessionsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_session_schema_1 = require("../schemas/conversation-session.schema");
const session_types_1 = require("../types/session.types");
const SESSION_PROJECTION = '-_id -__v';
let SessionsRepository = class SessionsRepository {
    sessionModel;
    constructor(sessionModel) {
        this.sessionModel = sessionModel;
    }
    async upsertSession(dto, now) {
        const update = {
            $setOnInsert: {
                sessionId: dto.sessionId,
                status: session_types_1.SessionStatus.Initiated,
                language: dto.language,
                metadata: dto.metadata,
                startedAt: now,
                endedAt: null,
            },
        };
        return this.sessionModel
            .findOneAndUpdate({ sessionId: dto.sessionId }, update, {
            upsert: true,
            new: true,
        })
            .select(SESSION_PROJECTION)
            .lean()
            .exec();
    }
    async findBySessionId(sessionId) {
        return this.sessionModel
            .findOne({ sessionId })
            .select(SESSION_PROJECTION)
            .lean()
            .exec();
    }
    async exists(sessionId) {
        const existing = await this.sessionModel.exists({ sessionId });
        return Boolean(existing);
    }
    async completeSession(sessionId, endedAt) {
        return this.sessionModel
            .findOneAndUpdate({ sessionId, status: { $ne: session_types_1.SessionStatus.Completed } }, { $set: { status: session_types_1.SessionStatus.Completed, endedAt } }, { new: true })
            .select(SESSION_PROJECTION)
            .lean()
            .exec();
    }
};
exports.SessionsRepository = SessionsRepository;
exports.SessionsRepository = SessionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_session_schema_1.ConversationSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SessionsRepository);
//# sourceMappingURL=sessions.repository.js.map