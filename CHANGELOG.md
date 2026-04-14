# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- NestJS 10+ project scaffolded with TypeScript 5+
- PostgreSQL 16+ integration via TypeORM 0.3+
- Redis 7+ integration for caching and session management
- Configuration management with `@nestjs/config` and environment validation
- Auth DTOs: `LoginDto`, `RegisterPortalUserDto`, `TokenResponseDto`, `RefreshTokenDto`
- Base entities: `BaseUserEntity`, `CrmUserEntity`, `PortalUserEntity`, `RoleEntity`, `RefreshTokenEntity`
- `RedisService` and `RedisModule` for centralized Redis operations
- `.env.example` with all required environment variables
- `.gitignore` following Node.js/NestJS best practices
- `README.md` with comprehensive project documentation
- Default unit test for `AppController`

### Fixed

- TypeScript compilation errors in config files (nullish coalescing for `parseInt`)

### Added

- `REDIS_ENABLED` environment variable to toggle Redis caching on/off
- Conditional Redis initialization: when `REDIS_ENABLED=false`, app runs without caching
- `isEnabled()` method in `RedisService` for runtime cache availability checks
- Graceful fallback in all Redis methods when caching is disabled

### Fixed

- Application port now correctly reads from `APP_PORT` in `.env` via ConfigService
- Added startup banner displaying current configuration (port, prefix, database, Redis, Swagger)

### Changed

- EXAMPLES.md очищен и заполняется только готовыми эндпоинтами по мере их реализации

### Added

- `EXAMPLES.md` with API request examples organized by endpoint (3+ examples per endpoint, each with method, URL, headers, body)
- Swagger UI at `/api/docs` with Bearer auth, tags, and descriptions

### Changed

- **Scope changed:** сервис теперь управляет только Portal Users (CRM вынесен в отдельный микросервис)
- Updated README.md to reflect portal-only scope (removed CRM endpoints and descriptions)
- Simplified Swagger tags: auth, portal-users, health (removed crm-users, roles)
