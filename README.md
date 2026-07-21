# Moto Inventario

Sistema profesional de inventario para tienda de refacciones de motocicletas.

## Tecnologías

- **Backend**: Node.js + Tauri
- **Frontend**: Vue 3 + TypeScript + TailwindCSS
- **Base de datos**: SQLite + Prisma ORM
- **Estado**: Pinia
- **Enrutamiento**: Vue Router

## Arquitectura

Clean Architecture con 4 capas:
- **Presentation Layer**: Vue components, composables, stores
- **Application Layer**: Services, DTOs, mappers
- **Domain Layer**: Entities, value objects, domain services
- **Infrastructure Layer**: Repositories, database

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Construcción

```bash
npm run build
```

## Base de datos

Generar cliente Prisma:
```bash
npm run prisma:generate
```

Ejecutar migraciones:
```bash
npm run prisma:migrate
```

Ver base de datos:
```bash
npm run prisma:studio
```

## Estructura del proyecto

```
moto-inventario/
├── src/                    # Frontend Vue
│   ├── presentation/       # UI layer
│   ├── stores/            # Pinia stores
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilities
│   └── assets/            # Static assets
├── src-tauri/             # Backend Tauri
│   ├── src/
│   │   ├── domain/        # Domain layer
│   │   ├── application/   # Application layer
│   │   ├── infrastructure/# Infrastructure layer
│   │   ├── api/           # Tauri commands
│   │   └── shared/        # Shared utilities
│   └── prisma/            # Database schema
└── database/              # SQLite database
```
