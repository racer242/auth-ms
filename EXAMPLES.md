# API Examples

Все запросы выполняются к `http://localhost:3000/api/v1`.

---

## Health Check

### GET /

Проверка состояния сервиса.

#### Example 1 — Service is healthy

```http
GET /
Host: localhost:3000
```

**Response `200 OK`**

```text
Hello World!
```
