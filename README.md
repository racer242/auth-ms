# Auth Microservice

Микросервис авторизации и управления пользователями с поддержкой JWT аутентификации, ролей и блокировки пользователей.

## Технологический стек

- **Runtime:** Node.js 20+ (LTS)
- **Framework:** NestJS 10+
- **Language:** TypeScript 5+
- **ORM:** TypeORM 0.3+
- **Database:** PostgreSQL 16+
- **Cache/Session:** Redis 7+
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger (OpenAPI 3.0)
- **Testing:** Jest + Supertest
- **Containerization:** Docker + Docker Compose

## Архитектура

Микросервис поддерживает два типа пользователей:

- **CRM Users** - пользователи CRM системы с ролевой моделью
- **Portal Users** - пользователи портала с персональными данными

Разделение реализовано через Table-per-Type (TPT) паттерн с абстрактным базовым классом.

## Безопасность

- **Аутентификация:** JWT (Access + Refresh tokens)
- **Хэширование паролей:** Argon2id
- **Refresh Token Rotation** - каждый update генерирует новый токен
- **Redis Blacklist** - мгновенная инвалидация сессий при блокировке
- **Rate Limiting** - защита от brute force атак
- **Security Headers** - Helmet для HTTP headers

## API Документация

После запуска Swagger доступен по адресу: `http://localhost:3000/api/docs`

### Основные эндпоинты

#### Auth

- `POST /api/v1/auth/crm/login` - Вход для CRM пользователей
- `POST /api/v1/auth/portal/login` - Вход для пользователей портала
- `POST /api/v1/auth/portal/register` - Регистрация пользователя портала
- `POST /api/v1/auth/refresh` - Обновление токенов (Rotation)
- `POST /api/v1/auth/logout` - Выход (инвалидация refresh token)
- `POST /api/v1/auth/logout-all` - Выход со всех устройств
- `GET /api/v1/auth/verify` - Верификация access токена

#### CRM Users (требуются роли admin/super_admin)

- `GET /api/v1/crm/users` - Список CRM пользователей с пагинацией
- `POST /api/v1/crm/users` - Создание CRM пользователя
- `GET /api/v1/crm/users/:id` - Получение CRM пользователя
- `PATCH /api/v1/crm/users/:id` - Обновление CRM пользователя
- `DELETE /api/v1/crm/users/:id` - Мягкое удаление
- `PATCH /api/v1/crm/users/:id/block` - Блокировка пользователя
- `PATCH /api/v1/crm/users/:id/unblock` - Разблокировка
- `POST /api/v1/crm/users/:id/roles` - Назначение роли
- `DELETE /api/v1/crm/users/:id/roles/:roleSlug` - Снятие роли

#### Portal Users

- `GET /api/v1/portal/users/me` - Профиль текущего пользователя
- `PATCH /api/v1/portal/users/me` - Обновление профиля
- `PATCH /api/v1/portal/users/me/password` - Изменение пароля
- `GET /api/v1/portal/users` (Admin only) - Список пользователей
- `PATCH /api/v1/portal/users/:id/block` (Admin only) - Блокировка

#### Roles

- `GET /api/v1/crm/roles` - Список всех ролей
- `POST /api/v1/crm/roles` - Создание роли
- `PATCH /api/v1/crm/roles/:id` - Обновление роли

## Установка и запуск

### Локальная разработка

1. Клонируйте репозиторий
2. Установите зависимости:

   ```bash
   npm install
   ```

3. Создайте `.env` файл на основе `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Настройте переменные окружения ( PostgreSQL и Redis должны быть запущены)

5. Запустите миграции:

   ```bash
   npm run typeorm migration:run
   ```

6. Запустите сиды:

   ```bash
   npm run seed
   ```

7. Запустите приложение:
   ```bash
   npm run start:dev
   ```

### Docker Compose

```bash
docker-compose up -d
```

Сервис будет доступен на `http://localhost:3000`
Swagger: `http://localhost:3000/api/docs`
Health check: `http://localhost:3000/health`

## Переменные окружения

### App

- `NODE_ENV` - окружение (development/production/test)
- `APP_PORT` - порт приложения (3000)
- `APP_PREFIX` - префикс API (api/v1)

### Database

- `DB_HOST` - хост PostgreSQL
- `DB_PORT` - порт PostgreSQL (5432)
- `DB_NAME` - имя базы данных
- `DB_USER` - пользователь БД
- `DB_PASSWORD` - пароль БД
- `DB_POOL_SIZE` - размер пула соединений
- `DB_SSL` - использование SSL

### Redis

- `REDIS_HOST` - хост Redis
- `REDIS_PORT` - порт Redis (6379)
- `REDIS_PASSWORD` - пароль Redis
- `REDIS_DB` - номер БД Redis
- `REDIS_TTL` - TTL для кэша по умолчанию

### JWT

- `JWT_ACCESS_SECRET` - секрет access токена (мин. 64 символа)
- `JWT_ACCESS_EXPIRY` - TTL access токена в секундах (900 = 15 мин)
- `JWT_REFRESH_SECRET` - секрет refresh токена (мин. 64 символа)
- `JWT_REFRESH_EXPIRY` - TTL refresh токена (604800 = 7 дней)
- `JWT_REFRESH_EXPIRY_REMEMBER` - TTL при rememberMe (2592000 = 30 дней)

### Security

- `ARGON2_MEMORY` - память для Argon2 (65536)
- `ARGON2_ITERATIONS` - итерации Argon2 (3)
- `ARGON2_PARALLELISM` - параллелизм Argon2 (4)

### Rate Limit

- `THROTTLE_TTL` - окно rate limiting (60000 мс)
- `THROTTLE_LIMIT` - лимит запросов (100)
- `AUTH_THROTTLE_LOGIN_TTL` - окно для login (60000 мс)
- `AUTH_THROTTLE_LOGIN_LIMIT` - лимит login попыток (5)

### Swagger

- `SWAGGER_ENABLED` - включить Swagger
- `SWAGGER_TITLE` - заголовок Swagger
- `SWAGGER_VERSION` - версия API

## Структура проекта

```
auth-microservice/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/               # Конфигурации (database, jwt, redis, app)
│   ├── common/               # Общие компоненты
│   │   ├── decorators/       # Кастомные декораторы
│   │   ├── guards/           # Guards (JWT, Roles, Refresh Token)
│   │   ├── filters/          # Exception filters
│   │   ├── interceptors/     # Interceptors (Logging)
│   │   ├── pipes/            # Validation pipes
│   │   ├── services/         # Общие сервисы (Redis)
│   │   └── types/            # Общие типы
│   ├── database/             # Миграции и сиды
│   │   ├── migrations/
│   │   └── seeds/
│   └── modules/              # Модули приложения
│       ├── auth/             # Аутентификация
│       ├── users/            # Базовые пользователи
│       ├── crm-users/        # CRM пользователи
│       ├── portal-users/     # Портал пользователи
│       ├── roles/            # Роли и permissions
│       └── tokens/           # Refresh токены
├── test/                     # Тесты
│   ├── auth.e2e-spec.ts
│   ├── crm-users.e2e-spec.ts
│   └── portal-users.e2e-spec.ts
├── docker/                   # Docker конфигурация
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
└── README.md
```

## Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

## Миграции

```bash
# Создать миграцию
npm run typeorm migration:create -- -n migration_name

# Запустить миграции
npm run typeorm migration:run

# Откатить миграции
npm run typeorm migration:revert
```

## Health Checks

`GET /health` - проверка состояния сервиса

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

## Обновления

### Этап 1 - Инициализация проекта ✅

- Создан NestJS проект с нужной структурой
- Установлены все зависимости
- Настроен ConfigModule с валидацией .env
- Настроен TypeORM + Redis
- Создана структура директорий согласно ТЗ
- Созданы базовые entities: BaseUser, CrmUser, PortalUser, Role, RefreshToken
- Созданы DTO для авторизации
- Создан comprehensive README.md

## License

MIT
