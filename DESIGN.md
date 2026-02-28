# Design Notes

## 1. How did you ensure idempotency?

- Session creation uses an atomic upsert with `$setOnInsert`, so existing sessions are returned without mutation.
- Events use a unique compound index on `(sessionId, eventId)`. Duplicate inserts fail with a duplicate key error and return the existing event.
- Session completion uses a conditional update (`status != completed`) so repeated calls do not change data.

## 2. How does your design behave under concurrent requests?

- Concurrent session creation is safe because the unique index on `sessionId` plus atomic upsert guarantees a single record.
- Concurrent event inserts with the same `eventId` are protected by the unique index; one succeeds and the rest resolve to the existing event.
- Concurrent completion calls are safe because only the first update changes the document; the rest read the existing completed session.

## 3. What MongoDB indexes did you choose and why?

- `conversation_sessions`: unique index on `sessionId` for fast lookup and idempotency.
- `conversation_events`: unique compound index `(sessionId, eventId)` for idempotency.
- `conversation_events`: compound index `(sessionId, timestamp, eventId)` to support ordered reads and pagination.

## 4. How would you scale this system for millions of sessions per day?

- Shard by `sessionId` to distribute sessions and events evenly across shards.
- Keep events in a separate collection with the ordering index to optimize reads.
- Use horizontal scaling on stateless API servers with connection pooling.
- Apply retention policies (TTL or archiving) for old sessions/events.
- Consider cursor-based pagination for very large event histories.

## 5. What did you intentionally keep out of scope, and why?

- Authentication/authorization, background jobs, and external integrations are excluded per requirements.
- Advanced analytics or data pipelines are excluded to keep the solution focused and correct.
- Extensive performance tuning is deferred; correctness and clarity are prioritized.
