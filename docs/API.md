# Initial REST API

Base URL: `http://localhost:8080`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/shipments` | List shipments |
| GET | `/api/shipments/{trackingId}` | Track shipment |
| POST | `/api/shipments` | Create shipment |
| PUT | `/api/shipments/{trackingId}/status?status=IN_TRANSIT` | Update status |

Example POST body:

```json
{
  "senderName": "Nihar Karkera",
  "receiverName": "Avaneesh Gawde",
  "origin": "Mumbai",
  "destination": "Pune",
  "status": "ORDER_PLACED"
}
```
