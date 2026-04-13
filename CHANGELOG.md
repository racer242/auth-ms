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
