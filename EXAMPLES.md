# API Examples

Все запросы выполняются к `http://localhost:3000/api/v1`.

---

## Auth

### POST /auth/crm/login

Вход для CRM-пользователей.

#### Example 1 — Successful login (admin)

```http
POST /api/v1/auth/crm/login
Host: localhost:3000
Content-Type: application/json

{
  "login": "admin@magepromo.com",
  "password": "Admin@1234",
  "rememberMe": true
}
```

#### Example 2 — Successful login (manager)

```http
POST /api/v1/auth/crm/login
Host: localhost:3000
Content-Type: application/json

{
  "login": "manager_01",
  "password": "Manager!987",
  "rememberMe": false
}
```

#### Example 3 — Invalid credentials

```http
POST /api/v1/auth/crm/login
Host: localhost:3000
Content-Type: application/json

{
  "login": "admin@magepromo.com",
  "password": "wrong_password"
}
```

---

### POST /auth/portal/login

Вход для пользователей портала.

#### Example 1 — Login by email

```http
POST /api/v1/auth/portal/login
Host: localhost:3000
Content-Type: application/json

{
  "login": "user@example.com",
  "password": "UserPass@1"
}
```

#### Example 2 — Login by phone

```http
POST /api/v1/auth/portal/login
Host: localhost:3000
Content-Type: application/json

{
  "login": "+79991234567",
  "password": "UserPass@1"
}
```

#### Example 3 — Blocked user

```http
POST /api/v1/auth/portal/login
Host: localhost:3000
Content-Type: application/json

{
  "login": "blocked@example.com",
  "password": "UserPass@1"
}
```

---

### POST /auth/portal/register

Регистрация нового пользователя портала.

#### Example 1 — Minimal registration

```http
POST /api/v1/auth/portal/register
Host: localhost:3000
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "NewUser@1234",
  "firstName": "Ivan",
  "lastName": "Ivanov"
}
```

#### Example 2 — With optional phone

```http
POST /api/v1/auth/portal/register
Host: localhost:3000
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "JaneSecure@1",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+79161234567",
  "locale": "ru"
}
```

#### Example 3 — Duplicate email (409 Conflict)

```http
POST /api/v1/auth/portal/register
Host: localhost:3000
Content-Type: application/json

{
  "email": "existing@example.com",
  "password": "Another@1234",
  "firstName": "Duplicate",
  "lastName": "User"
}
```

---

### POST /auth/refresh

Обновление пары токенов.

#### Example 1 — Standard refresh

```http
POST /api/v1/auth/refresh
Host: localhost:3000
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Example 2 — Refresh with rotation (new token returned)

```http
POST /api/v1/auth/refresh
Host: localhost:3000
Content-Type: application/json

{
  "refreshToken": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
}
```

#### Example 3 — Expired/revoked token (401 Unauthorized)

```http
POST /api/v1/auth/refresh
Host: localhost:3000
Content-Type: application/json

{
  "refreshToken": "00000000-0000-0000-0000-000000000000"
}
```

---

### POST /auth/logout

Выход (инвалидация refresh token).

#### Example 1 — Standard logout

```http
POST /api/v1/auth/logout
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Example 2 — Logout from second device

```http
POST /api/v1/auth/logout
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "refreshToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

#### Example 3 — Already revoked token

```http
POST /api/v1/auth/logout
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### POST /auth/logout-all

Выход со всех устройств.

#### Example 1 — Revoke all sessions

```http
POST /api/v1/auth/logout-all
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 2 — User with single session

```http
POST /api/v1/auth/logout-all
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 3 — Missing token (401 Unauthorized)

```http
POST /api/v1/auth/logout-all
Host: localhost:3000
```

---

### GET /auth/verify

Верификация access токена.

#### Example 1 — Valid token

```http
GET /api/v1/auth/verify
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 2 — CRM user token (with roles)

```http
GET /api/v1/auth/verify
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 3 — Expired token (401 Unauthorized)

```http
GET /api/v1/auth/verify
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired...
```

---

## CRM Users

### GET /crm/users

Список CRM-пользователей с пагинацией.

#### Example 1 — Default pagination

```http
GET /api/v1/crm/users?page=1&limit=20
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 2 — Search with role filter

```http
GET /api/v1/crm/users?search=admin&role=admin&sortBy=createdAt&sortOrder=DESC
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 3 — Blocked users only

```http
GET /api/v1/crm/users?isBlocked=true&sortBy=lastName&sortOrder=ASC
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### POST /crm/users

Создание CRM-пользователя.

#### Example 1 — Create user with admin role

```http
POST /api/v1/crm/users
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "email": "operator@magepromo.com",
  "username": "operator_01",
  "password": "Operator@1234",
  "firstName": "Alex",
  "lastName": "Petrov",
  "roles": ["operator"]
}
```

#### Example 2 — Create manager with multiple roles

```http
POST /api/v1/crm/users
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "email": "lead@magepromo.com",
  "username": "lead_manager",
  "password": "LeadMgr@5678",
  "firstName": "Maria",
  "lastName": "Sidorova",
  "roles": ["manager", "operator"]
}
```

#### Example 3 — Duplicate email (409 Conflict)

```http
POST /api/v1/crm/users
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "email": "admin@magepromo.com",
  "username": "another_admin",
  "password": "Another@1234",
  "firstName": "Duplicate",
  "lastName": "Admin",
  "roles": ["admin"]
}
```

---

### PATCH /crm/users/:id/block

Блокировка пользователя.

#### Example 1 — Block with reason

```http
PATCH /api/v1/crm/users/550e8400-e29b-41d4-a716-446655440000/block
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "reason": "Нарушение политик безопасности"
}
```

#### Example 2 — Block for suspicious activity

```http
PATCH /api/v1/crm/users/6ba7b810-9dad-11d1-80b4-00c04fd430c8/block
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "reason": "Подозрительная активность — множественные попытки входа"
}
```

#### Example 3 — Block already blocked user

```http
PATCH /api/v1/crm/users/7c9e6679-7425-40de-944b-e07fc1f90ae7/block
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "reason": "Дополнительное ограничение"
}
```

---

### POST /crm/users/:id/roles

Назначение роли.

#### Example 1 — Assign operator role

```http
POST /api/v1/crm/users/550e8400-e29b-41d4-a716-446655440000/roles
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "roleSlug": "operator"
}
```

#### Example 2 — Promote to manager

```http
POST /api/v1/crm/users/6ba7b810-9dad-11d1-80b4-00c04fd430c8/roles
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "roleSlug": "manager"
}
```

#### Example 3 — Assign admin role

```http
POST /api/v1/crm/users/7c9e6679-7425-40de-944b-e07fc1f90ae7/roles
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "roleSlug": "admin"
}
```

---

## Portal Users

### GET /portal/users/me

Получение профиля текущего пользователя.

#### Example 1 — Full profile

```http
GET /api/v1/portal/users/me
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 2 — Profile with missing optional fields

```http
GET /api/v1/portal/users/me
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 3 — Missing token (401 Unauthorized)

```http
GET /api/v1/portal/users/me
Host: localhost:3000
```

---

### PATCH /portal/users/me

Обновление профиля.

#### Example 1 — Update name and phone

```http
PATCH /api/v1/portal/users/me
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "firstName": "Alexander",
  "lastName": "Volkov",
  "phone": "+79261234567"
}
```

#### Example 2 — Update address and timezone

```http
PATCH /api/v1/portal/users/me
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "city": "Saint Petersburg",
  "address": "Nevsky pr., 28",
  "postalCode": "191025",
  "timezone": "Europe/Moscow"
}
```

#### Example 3 — Update birth date and gender

```http
PATCH /api/v1/portal/users/me
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "birthDate": "1990-05-15",
  "gender": "male",
  "locale": "en"
}
```

---

### PATCH /portal/users/me/password

Изменение пароля.

#### Example 1 — Successful password change

```http
PATCH /api/v1/portal/users/me/password
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "currentPassword": "OldPass@1234",
  "newPassword": "NewSecure@5678",
  "confirmPassword": "NewSecure@5678"
}
```

#### Example 2 — Wrong current password

```http
PATCH /api/v1/portal/users/me/password
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "currentPassword": "WrongPass@1",
  "newPassword": "NewSecure@5678",
  "confirmPassword": "NewSecure@5678"
}
```

#### Example 3 — Password mismatch

```http
PATCH /api/v1/portal/users/me/password
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "currentPassword": "OldPass@1234",
  "newPassword": "NewSecure@5678",
  "confirmPassword": "Different@9999"
}
```

---

## Roles

### GET /crm/roles

Список всех ролей.

#### Example 1 — All roles

```http
GET /api/v1/crm/roles
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 2 — Admin role detail

```http
GET /api/v1/crm/roles
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Example 3 — Operator role permissions

```http
GET /api/v1/crm/roles
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Health Check

### GET /health

Проверка состояния сервиса.

#### Example 1 — All services up

```http
GET /health
Host: localhost:3000
```

#### Example 2 — Database down

```http
GET /health
Host: localhost:3000
```

#### Example 3 — Redis disabled

```http
GET /health
Host: localhost:3000
```
