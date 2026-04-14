# API Examples

Все запросы выполняются к `http://localhost:3000/api/v1`.

---

## Health Check

### GET /health

Проверка состояния сервиса.

#### Example 1 — Service is healthy

```http
GET /health
Host: localhost:3000
```

**Response `200 OK`**

```json
"Hello World!"
```
