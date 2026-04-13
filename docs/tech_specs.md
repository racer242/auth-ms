# Техническое задание для ИИ-агента (Qwen-Code)

## Микросервис авторизации и управления пользователями

---

## 1. ОБЩИЕ СВЕДЕНИЯ

| Параметр         | Значение                                              |
| ---------------- | ----------------------------------------------------- |
| Название         | Auth Microservice                                     |
| Стек             | NestJS, PostgreSQL, TypeORM, Redis                    |
| Архитектура      | Microservice (транспорт: TCP/gRPC + REST API Gateway) |
| Аутентификация   | JWT (Access + Refresh tokens)                         |
| Среда разработки | VS Code + Qwen-Code                                   |

---

## 2. ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Основной стек

```
Runtime:         Node.js 20+ (LTS)
Framework:       NestJS 10+
Language:        TypeScript 5+
ORM:             TypeORM 0.3+
Database:        PostgreSQL 16+
Cache/Session:   Redis 7+
Validation:      class-validator + class-transformer
Documentation:   Swagger (OpenAPI 3.0)
Testing:         Jest + Supertest
Containerization: Docker + Docker Compose
```

### Дополнительные пакеты

```
@nestjs/jwt              — работа с JWT токенами
@nestjs/passport         — стратегии аутентификации
@nestjs/throttler        — rate limiting
@nestjs/microservices    — межсервисное взаимодействие
passport-jwt             — JWT стратегия
passport-local           — Local стратегия
bcrypt                   — хэширование паролей
argon2                   — альтернатива bcrypt (приоритет)
ioredis                  — Redis клиент
uuid                     — генерация UUID
helmet                   — HTTP security headers
class-validator          — валидация DTO
```

---

## 3. АРХИТЕКТУРА ПРОЕКТА

### 3.1 Структура директорий

```
auth-microservice/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── refresh-token.guard.ts
│   │   │   └── throttler.guard.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── types/
│   │       ├── jwt-payload.type.ts
│   │       └── token-pair.type.ts
│   │
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_base_users.ts
│   │   │   ├── 002_create_crm_users.ts
│   │   │   ├── 003_create_portal_users.ts
│   │   │   └── 004_create_refresh_tokens.ts
│   │   └── seeds/
│   │       └── admin.seed.ts
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── token-response.dto.ts
│   │   │       └── refresh-token.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── entities/
│   │   │   │   └── base-user.entity.ts      ← абстрактная сущность
│   │   │   └── dto/
│   │   │       └── base-user.dto.ts
│   │   │
│   │   ├── crm-users/
│   │   │   ├── crm-users.module.ts
│   │   │   ├── crm-users.controller.ts
│   │   │   ├── crm-users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── crm-user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-crm-user.dto.ts
│   │   │       ├── update-crm-user.dto.ts
│   │   │       └── crm-user-response.dto.ts
│   │   │
│   │   ├── portal-users/
│   │   │   ├── portal-users.module.ts
│   │   │   ├── portal-users.controller.ts
│   │   │   ├── portal-users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── portal-user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-portal-user.dto.ts
│   │   │       ├── update-portal-user.dto.ts
│   │   │       └── portal-user-response.dto.ts
│   │   │
│   │   ├── roles/
│   │   │   ├── roles.module.ts
│   │   │   ├── roles.service.ts
│   │   │   ├── entities/
│   │   │   │   └── role.entity.ts
│   │   │   └── dto/
│   │   │       └── assign-role.dto.ts
│   │   │
│   │   └── tokens/
│   │       ├── tokens.module.ts
│   │       ├── tokens.service.ts
│   │       └── entities/
│   │           └── refresh-token.entity.ts
│   │
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts
│
├── test/
│   ├── auth.e2e-spec.ts
│   ├── crm-users.e2e-spec.ts
│   └── portal-users.e2e-spec.ts
│
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── docker-compose.yml
│
├── .env.example
├── .env.test
├── nest-cli.json
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. МОДЕЛЬ ДАННЫХ

### 4.1 Схема разделения пользователей

```
Принцип: Table-per-Type (TPT) через абстрактный базовый класс
Оптимизация: отдельные таблицы, индексы по горячим полям

┌─────────────────────────────────────────┐
│           base_users (abstract)         │
│  Общие поля: id, email, password_hash,  │
│  user_type, is_active, is_blocked,      │
│  blocked_at, blocked_reason,            │
│  created_at, updated_at, last_login_at  │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────────┐
│  crm_users  │  │  portal_users    │
│  (легкие)   │  │  (с персданными) │
└─────────────┘  └──────────────────┘
       │
       ▼
┌─────────────┐
│    roles    │ (many-to-many через crm_user_roles)
└─────────────┘
```

### 4.2 Сущности базы данных

#### Таблица `crm_users`

```sql
CREATE TABLE crm_users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_blocked      BOOLEAN NOT NULL DEFAULT false,
    blocked_at      TIMESTAMPTZ,
    blocked_reason  TEXT,
    blocked_by      UUID REFERENCES crm_users(id),
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы для горячих запросов
CREATE INDEX idx_crm_users_email ON crm_users(email);
CREATE INDEX idx_crm_users_username ON crm_users(username);
CREATE INDEX idx_crm_users_is_active ON crm_users(is_active) WHERE is_active = true;
CREATE INDEX idx_crm_users_is_blocked ON crm_users(is_blocked);
```

#### Таблица `portal_users`

```sql
CREATE TABLE portal_users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20) UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    -- Персональные данные
    first_name          VARCHAR(100),
    last_name           VARCHAR(100),
    middle_name         VARCHAR(100),
    birth_date          DATE,
    gender              VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    avatar_url          VARCHAR(500),
    -- Адрес
    country             VARCHAR(100),
    city                VARCHAR(100),
    address             TEXT,
    postal_code         VARCHAR(20),
    -- Настройки
    locale              VARCHAR(10) DEFAULT 'ru',
    timezone            VARCHAR(50) DEFAULT 'Europe/Moscow',
    email_verified      BOOLEAN NOT NULL DEFAULT false,
    phone_verified      BOOLEAN NOT NULL DEFAULT false,
    email_verified_at   TIMESTAMPTZ,
    -- Блокировка
    is_active           BOOLEAN NOT NULL DEFAULT true,
    is_blocked          BOOLEAN NOT NULL DEFAULT false,
    blocked_at          TIMESTAMPTZ,
    blocked_reason      TEXT,
    -- Метаданные
    metadata            JSONB DEFAULT '{}',
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_portal_users_email ON portal_users(email);
CREATE INDEX idx_portal_users_phone ON portal_users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_portal_users_is_blocked ON portal_users(is_blocked);
CREATE INDEX idx_portal_users_email_verified ON portal_users(email_verified);
```

#### Таблица `roles`

```sql
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    slug        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Предустановленные роли CRM
INSERT INTO roles (name, slug, permissions) VALUES
('Суперадмин',  'super_admin',  '["*"]'),
('Администратор','admin',       '["users:read","users:write","users:delete"]'),
('Менеджер',    'manager',      '["users:read","users:write"]'),
('Оператор',    'operator',     '["users:read"]');
```

#### Таблица `crm_user_roles`

```sql
CREATE TABLE crm_user_roles (
    crm_user_id UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE,
    role_id     INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES crm_users(id),
    PRIMARY KEY (crm_user_id, role_id)
);

CREATE INDEX idx_crm_user_roles_user ON crm_user_roles(crm_user_id);
```

#### Таблица `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    user_type       VARCHAR(20) NOT NULL CHECK (user_type IN ('crm', 'portal')),
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    is_revoked      BOOLEAN NOT NULL DEFAULT false,
    revoked_at      TIMESTAMPTZ,
    user_agent      VARCHAR(500),
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Индексы
    INDEX idx_refresh_tokens_user (user_id, user_type),
    INDEX idx_refresh_tokens_expires (expires_at)
);
```

---

## 5. API СПЕЦИФИКАЦИЯ

### 5.1 Базовый URL

```
REST API:  /api/v1
Health:    /health
Swagger:   /api/docs
```

### 5.2 Эндпоинты авторизации (`/api/v1/auth`)

#### POST `/api/v1/auth/crm/login`

Вход для CRM-пользователей

```typescript
// Request Body
{
  "login": "string",       // email или username
  "password": "string",
  "rememberMe": boolean    // опционально, продлевает refresh token
}

// Response 200
{
  "accessToken": "string",   // JWT, TTL: 15 минут
  "refreshToken": "string",  // UUID, TTL: 7 / 30 дней
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "roles": ["string"],
    "permissions": ["string"]
  }
}

// Response 401 — неверные credentials
// Response 403 — пользователь заблокирован
// Response 429 — rate limit exceeded
```

#### POST `/api/v1/auth/portal/login`

Вход для пользователей портала

```typescript
// Request Body
{
  "login": "string",     // email или phone
  "password": "string"
}

// Response 200
{
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "email": "string",
    "phone": "string",
    "firstName": "string",
    "lastName": "string",
    "emailVerified": boolean
  }
}
```

#### POST `/api/v1/auth/portal/register`

Регистрация пользователя портала

```typescript
// Request Body
{
  "email": "string",        // required, уникальный
  "password": "string",     // min 8, uppercase, number, special char
  "firstName": "string",    // required
  "lastName": "string",     // required
  "phone": "string",        // опционально
  "locale": "string"        // опционально, default: 'ru'
}

// Response 201
{
  "id": "uuid",
  "email": "string",
  "message": "Регистрация успешна. Проверьте email для подтверждения."
}

// Response 409 — email уже существует
```

#### POST `/api/v1/auth/refresh`

Обновление пары токенов (Refresh Token Rotation)

```typescript
// Request Body
{
  "refreshToken": "string"
}

// Response 200
{
  "accessToken": "string",
  "refreshToken": "string",  // новый токен (старый инвалидируется)
  "tokenType": "Bearer",
  "expiresIn": 900
}

// Response 401 — токен невалиден/истек
```

#### POST `/api/v1/auth/logout`

Выход (инвалидация refresh token)

```typescript
// Headers: Authorization: Bearer <accessToken>
// Request Body
{
  "refreshToken": "string"
}

// Response 200
{
  "message": "Успешный выход"
}
```

#### POST `/api/v1/auth/logout-all`

Выход со всех устройств

```typescript
// Headers: Authorization: Bearer <accessToken>
// Response 200
{
  "message": "Все сессии завершены",
  "revokedCount": number
}
```

#### GET `/api/v1/auth/verify`

Верификация access токена (для других микросервисов)

```typescript
// Headers: Authorization: Bearer <accessToken>
// Response 200
{
  "valid": true,
  "userId": "uuid",
  "userType": "crm" | "portal",
  "roles": ["string"],
  "permissions": ["string"]
}

// Response 401 — невалидный токен
```

### 5.3 Эндпоинты CRM-пользователей (`/api/v1/crm/users`)

> 🔐 Все эндпоинты защищены JWT + проверкой ролей

#### GET `/api/v1/crm/users`

Список CRM-пользователей с пагинацией

```typescript
// Query Params
{
  "page": number,       // default: 1
  "limit": number,      // default: 20, max: 100
  "search": "string",   // поиск по email, username, имени
  "role": "string",     // фильтр по роли
  "isBlocked": boolean, // фильтр по статусу блокировки
  "sortBy": "createdAt" | "email" | "lastName",
  "sortOrder": "ASC" | "DESC"
}

// Roles required: admin, super_admin
// Response 200
{
  "data": [CrmUserResponse],
  "meta": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### POST `/api/v1/crm/users`

Создание CRM-пользователя

```typescript
// Roles required: admin, super_admin
// Request Body
{
  "email": "string",
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "roles": ["string"]   // slugs ролей
}
```

#### GET `/api/v1/crm/users/:id`

Получение CRM-пользователя по ID

#### PATCH `/api/v1/crm/users/:id`

Обновление CRM-пользователя

#### DELETE `/api/v1/crm/users/:id`

Мягкое удаление (soft delete) CRM-пользователя

#### PATCH `/api/v1/crm/users/:id/block`

Блокировка пользователя

```typescript
// Roles required: admin, super_admin
// Request Body
{
  "reason": "string"   // обязательная причина блокировки
}

// Response 200
{
  "id": "uuid",
  "isBlocked": true,
  "blockedAt": "ISO date",
  "blockedReason": "string",
  "blockedBy": "uuid"
}
```

#### PATCH `/api/v1/crm/users/:id/unblock`

Разблокировка пользователя

#### POST `/api/v1/crm/users/:id/roles`

Назначение роли пользователю

```typescript
// Request Body
{
  "roleSlug": "string"
}
```

#### DELETE `/api/v1/crm/users/:id/roles/:roleSlug`

Снятие роли с пользователя

### 5.4 Эндпоинты пользователей портала (`/api/v1/portal/users`)

#### GET `/api/v1/portal/users/me`

Получение профиля текущего пользователя

```typescript
// Headers: Authorization: Bearer <accessToken>
// Response 200
{
  "id": "uuid",
  "email": "string",
  "phone": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "birthDate": "date",
  "gender": "string",
  "avatarUrl": "string",
  "country": "string",
  "city": "string",
  "locale": "string",
  "timezone": "string",
  "emailVerified": boolean,
  "phoneVerified": boolean,
  "createdAt": "ISO date",
  "lastLoginAt": "ISO date"
}
```

#### PATCH `/api/v1/portal/users/me`

Обновление профиля текущего пользователя

```typescript
// Только разрешённые поля для самостоятельного изменения
{
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "birthDate": "date",
  "gender": "string",
  "phone": "string",
  "country": "string",
  "city": "string",
  "address": "string",
  "postalCode": "string",
  "locale": "string",
  "timezone": "string"
}
```

#### PATCH `/api/v1/portal/users/me/password`

Изменение пароля

```typescript
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

#### GET `/api/v1/portal/users` _(Admin only)_

Список пользователей портала (только для CRM-администраторов)

#### GET `/api/v1/portal/users/:id` _(Admin only)_

Получение пользователя портала по ID

#### PATCH `/api/v1/portal/users/:id/block` _(Admin only)_

Блокировка пользователя портала

#### PATCH `/api/v1/portal/users/:id/unblock` _(Admin only)_

### 5.5 Эндпоинты ролей (`/api/v1/crm/roles`)

#### GET `/api/v1/crm/roles`

Список всех ролей с permissions

#### POST `/api/v1/crm/roles`

Создание новой роли

#### PATCH `/api/v1/crm/roles/:id`

Обновление роли

---

## 6. БИЗНЕС-ЛОГИКА

### 6.1 Стратегия аутентификации

```
JWT Access Token:
  - TTL: 15 минут
  - Алгоритм: RS256 (asymmetric) — приватный ключ для подписи,
    публичный ключ доступен другим сервисам
  - Payload: { sub, userType, roles, permissions, iat, exp }
  - Хранение: только в памяти клиента (не в localStorage)

Refresh Token:
  - TTL: 7 дней (30 дней при rememberMe)
  - Стратегия: Refresh Token Rotation (каждое обновление — новый токен)
  - Хранение: хэш в БД + Redis кэш для быстрой инвалидации
  - Family detection: защита от Refresh Token Reuse
```

### 6.2 Алгоритм блокировки пользователя

```
1. Проверка прав инициатора (только admin/super_admin)
2. Обновление is_blocked = true, blocked_at, blocked_reason, blocked_by
3. Инвалидация ВСЕХ активных refresh токенов пользователя (Redis + DB)
4. Добавление user_id в Redis blacklist (для мгновенного эффекта)
5. При следующем запросе — проверка blacklist до верификации JWT
```

### 6.3 Защита от атак

```
Rate Limiting:
  - /auth/*/login:    5 попыток / 1 минута / IP
  - /auth/*/register: 3 попытки / 1 час / IP
  - Общий:           100 req / 1 минута / IP

Защита паролей:
  - Хэширование: Argon2id (memory: 65536, iterations: 3, parallelism: 4)
  - Требования: min 8 символов, 1 заглавная, 1 цифра, 1 спецсимвол

Защита токенов:
  - Refresh Token Reuse Detection
  - Blacklist заблокированных пользователей в Redis
  - Ротация секретов через env

Security Headers (Helmet):
  - X-Content-Type-Options, X-Frame-Options
  - Content-Security-Policy, HSTS
```

### 6.4 Кэширование (Redis)

```
Ключи и TTL:
  auth:blacklist:{userId}:{userType}    → SET, TTL = max JWT TTL (15 мин)
  auth:refresh:{tokenHash}              → STRING, TTL = token TTL
  auth:rate_limit:{ip}:{endpoint}       → COUNTER, TTL = window
  auth:user:crm:{id}                    → HASH, TTL = 5 минут
  auth:user:portal:{id}                 → HASH, TTL = 5 минут
  auth:roles:{userId}                   → STRING(JSON), TTL = 10 минут
```

---

## 7. РЕАЛИЗАЦИЯ КЛЮЧЕВЫХ КОМПОНЕНТОВ

### 7.1 BaseUser абстрактная сущность

```typescript
// src/modules/users/entities/base-user.entity.ts
export abstract class BaseUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @Column({ name: "password_hash" })
  passwordHash: string;

  @Column({ default: true, name: "is_active" })
  isActive: boolean;

  @Column({ default: false, name: "is_blocked" })
  @Index()
  isBlocked: boolean;

  @Column({ nullable: true, name: "blocked_at", type: "timestamptz" })
  blockedAt: Date | null;

  @Column({ nullable: true, name: "blocked_reason", type: "text" })
  blockedReason: string | null;

  @Column({ nullable: true, name: "last_login_at", type: "timestamptz" })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
```

### 7.2 JWT Payload

```typescript
// src/common/types/jwt-payload.type.ts
export interface JwtPayload {
  sub: string; // user ID
  userType: "crm" | "portal";
  email: string;
  roles?: string[]; // только для CRM
  permissions?: string[]; // только для CRM
  iat?: number;
  exp?: number;
}
```

### 7.3 Auth Service (ключевые методы)

```typescript
// src/modules/auth/auth.service.ts
interface IAuthService {
  validateCrmUser(login: string, password: string): Promise<CrmUser>;
  validatePortalUser(login: string, password: string): Promise<PortalUser>;
  loginCrm(user: CrmUser, meta: SessionMeta): Promise<TokenPair>;
  loginPortal(user: PortalUser, meta: SessionMeta): Promise<TokenPair>;
  refreshTokens(refreshToken: string, meta: SessionMeta): Promise<TokenPair>;
  logout(userId: string, refreshToken: string): Promise<void>;
  logoutAll(userId: string, userType: UserType): Promise<number>;
  verifyToken(token: string): Promise<JwtPayload>;
  revokeUserSessions(userId: string, userType: UserType): Promise<void>;
}
```

### 7.4 Guard проверки блокировки

```typescript
// src/common/guards/jwt-auth.guard.ts
// При каждом запросе:
// 1. Верификация JWT подписи
// 2. Проверка Redis blacklist (O(1) операция)
// 3. Если заблокирован — 403 Forbidden
// 4. Attach payload к request
```

---

## 8. КОНФИГУРАЦИЯ И ОКРУЖЕНИЕ

### 8.1 Переменные окружения `.env.example`

```ini
# App
NODE_ENV=development
APP_PORT=3000
APP_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_service
DB_USER=postgres
DB_PASSWORD=secret
DB_POOL_SIZE=10
DB_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=300

# JWT
JWT_ACCESS_SECRET=             # min 64 символа или path к приватному ключу
JWT_ACCESS_EXPIRY=900          # 15 минут в секундах
JWT_REFRESH_SECRET=            # min 64 символа
JWT_REFRESH_EXPIRY=604800      # 7 дней в секундах
JWT_REFRESH_EXPIRY_REMEMBER=2592000  # 30 дней

# Security
BCRYPT_ROUNDS=12               # для argon2: не используется
ARGON2_MEMORY=65536
ARGON2_ITERATIONS=3
ARGON2_PARALLELISM=4

# Rate Limit
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
AUTH_THROTTLE_LOGIN_TTL=60000
AUTH_THROTTLE_LOGIN_LIMIT=5

# Swagger
SWAGGER_ENABLED=true
SWAGGER_TITLE=Auth Microservice API
SWAGGER_VERSION=1.0
```

---

## 9. ТЕСТИРОВАНИЕ

### 9.1 Требования к покрытию

```
Unit Tests (Jest):
  - AuthService: покрытие > 90%
  - CrmUsersService: покрытие > 85%
  - PortalUsersService: покрытие > 85%
  - Guards/Strategies: покрытие > 80%

E2E Tests (Supertest):
  - Сценарии регистрации и входа
  - Сценарии refresh/logout
  - Сценарии блокировки
  - Проверка rate limiting
  - Проверка ролевого доступа
```

### 9.2 Обязательные тест-кейсы

```
✅ Успешный вход CRM пользователя
✅ Успешный вход портала
✅ Регистрация нового пользователя портала
✅ Отказ при неверном пароле
✅ Отказ заблокированного пользователя
✅ Обновление токенов (rotation)
✅ Повторное использование refresh token → отзыв всей семьи
✅ Назначение/снятие роли
✅ Блокировка пользователя + инвалидация сессий
✅ Rate limiting при превышении попыток входа
✅ Верификация токена для внутренних сервисов
```

---

## 10. DOCKER

### 10.1 `docker-compose.yml`

```yaml
version: "3.8"

services:
  auth-service:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

---

## 11. ПОРЯДОК РЕАЛИЗАЦИИ (ИНСТРУКЦИЯ ДЛЯ АГЕНТА)

### Этап 1 — Инициализация проекта

```
1. Создать NestJS проект: nest new auth-microservice
2. Установить все зависимости согласно п.2
3. Настроить TypeORM с PostgreSQL (Database Config)
4. Настроить подключение к Redis (ioredis)
5. Настроить ConfigModule (@nestjs/config) с валидацией env
6. Создать структуру директорий согласно п.3
```

### Этап 2 — База данных

```
1. Создать базовую абстрактную entity (BaseUserEntity)
2. Создать entity: CrmUser, PortalUser, Role, CrmUserRole, RefreshToken
3. Создать migrations для всех таблиц
4. Добавить seed для первичных ролей и супер-администратора
5. Настроить TypeORM CLI в package.json
```

### Этап 3 — Модуль Auth

```
1. Создать LocalStrategy (email/password валидация)
2. Создать JwtStrategy (верификация access token)
3. Создать JwtRefreshStrategy (верификация refresh token)
4. Реализовать AuthService с методами из п.7.3
5. Реализовать логику Refresh Token Rotation
6. Реализовать Redis blacklist для заблокированных пользователей
7. Создать AuthController с эндпоинтами из п.5.2
```

### Этап 4 — Модуль CRM Users

```
1. Создать CrmUsersService (CRUD + блокировка)
2. Создать CrmUsersController с эндпоинтами из п.5.3
3. Реализовать пагинацию и фильтрацию
4. Привязать к RolesService
```

### Этап 5 — Модуль Portal Users

```
1. Создать PortalUsersService (CRUD + блокировка)
2. Создать PortalUsersController с эндпоинтами из п.5.4
3. Разделить права: /me эндпоинты для самого пользователя,
   admin эндпоинты только для CRM-администраторов
```

### Этап 6 — Безопасность и оптимизация

```
1. Настроить Throttler Guard с кастомными лимитами для auth
2. Подключить Helmet
3. Настроить CORS
4. Реализовать глобальный HTTP Exception Filter
5. Реализовать Logging Interceptor
6. Настроить кэширование пользователей в Redis
```

### Этап 7 — Документация и тесты

```
1. Настроить Swagger с описанием всех DTO и ответов
2. Написать unit тесты для сервисов
3. Написать e2e тесты для ключевых сценариев
4. Заполнить README.md с инструкцией запуска
```

### Этап 8 — Docker и финализация

```
1. Создать Dockerfile (multi-stage build)
2. Создать docker-compose.yml
3. Настроить health check эндпоинт
4. Финальная проверка всех эндпоинтов через Swagger
```

---

## 12. КРИТЕРИИ ГОТОВНОСТИ

```
✅ Все эндпоинты из п.5 реализованы и задокументированы в Swagger
✅ Миграции создают корректную схему БД
✅ Argon2id используется для хэширования паролей
✅ RS256 JWT с ротацией refresh токенов
✅ Redis используется для blacklist и кэша
✅ Rate limiting работает на auth эндпоинтах
✅ Блокировка немедленно инвалидирует сессии через Redis
✅ Роли CRM работают (назначение, проверка, фильтрация доступа)
✅ Персональные данные портала изолированы от CRM-логики
✅ Покрытие тестами > 80%
✅ Проект запускается через docker-compose up
✅ Health check доступен на /health
```

---

_ТЗ подготовлено для исполнения ИИ-агентом Qwen-Code в VS Code_
_Версия: 1.0 | Стек: NestJS 10 + PostgreSQL 16 + Redis 7_
