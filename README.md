# Conversation Session Service

Backend take-home assignment implementation for managing conversation sessions and events.

## Requirements

- Node.js 18+
- MongoDB (local or Docker)

## Setup

```bash
npm install
```

### Environment

- `MONGO_URI` (optional)
  - Defaults to `mongodb://localhost:27017/conversation_sessions`
- `PORT` (optional)
  - Defaults to `3000`

## Run

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

## API

### Create or Upsert Session

```
POST /sessions
```

Body:

```json
{
  "sessionId": "session-123",
  "language": "en",
  "metadata": {
    "source": "ivr"
  }
}
```

### Add Event to Session

```
POST /sessions/:sessionId/events
```

Body:

```json
{
  "eventId": "event-1",
  "type": "user_speech",
  "payload": { "text": "Hello" },
  "timestamp": "2025-01-01T10:00:00.000Z"
}
```

### Get Session with Events

```
GET /sessions/:sessionId?limit=20&offset=0
```

### Complete Session

```
POST /sessions/:sessionId/complete
```

## Assumptions

- `sessionId` is provided by the caller and is unique.
- Upsert only creates on first request and does not mutate existing session fields.
- Pagination uses offset/limit with a maximum limit of 100.
