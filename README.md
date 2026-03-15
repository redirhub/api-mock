# API Mock Service

Dynamic API endpoint mocker that captures all requests to `/api/mock/*` endpoints and stores them for analysis. Perfect for testing webhooks, debugging API integrations, and Vercel deployments.

## Features

- **Dynamic endpoint capture**: Any request to `/api/mock/{slug}` gets logged
- **All HTTP methods supported**: GET, POST, PUT, PATCH, DELETE
- **Request logging**: Headers, body, query parameters, and timestamps
- **Slug-specific storage**: Separate Redis lists per endpoint slug
- **Automatic cleanup**: 24-hour TTL with memory optimization
- **Redis storage**: Uses Vercel KV for log persistence

## Usage

### Send requests to any API endpoint:

```bash
# These all get captured and logged
curl -X POST http://localhost:3000/api/mock/webhook -d '{"test": "data"}'
curl -X GET http://localhost:3000/api/mock/health?param=value
curl -X PUT http://localhost:3000/api/mock/users -d '{"name": "John"}'
```

### View logs:

```bash
# Get last 5 logs for specific endpoint (default)
curl http://localhost:3000/api/read/webhook

# Get more logs from specific endpoint
curl http://localhost:3000/api/read/webhook?limit=10

# View logs with formatted output
curl -Ss http://localhost:3000/api/read/health?limit=3 | jq
```

## API Endpoints

### `GET|POST|PUT|PATCH|DELETE /api/mock/{slug}`

Captures any request to a dynamic endpoint and logs it to Redis with key `logs:{slug}`.

**Response:**

```json
{
  "ok": true,
  "endpoint": "webhook"
}
```

### `GET /api/read/{slug}`

Retrieves logged requests for a specific slug.

**Query Parameters:**

- `limit` - Maximum results (default: 5)

**Response:**

```json
{
  "total": 3,
  "slug": "webhook",
  "limit": 5,
  "logs": [
    {
      "slug": "webhook",
      "method": "POST",
      "headers": {...},
      "body": {...},
      "time": 1703097600000,
      "timestamp": "2023-12-20T12:00:00.000Z"
    }
  ]
}
```

## Storage Details

- **Redis Keys**: `logs:{slug}` pattern for separation
- **TTL**: 24 hours automatic cleanup
- **Limits**: 100 entries max per slug (memory optimized)
- **Data**: JSON serialized request logs with timestamps
