# Star Wars API Backend

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)](https://graphql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)

GraphQL backend for the Star Wars API consumer, built with NestJS. Includes query statistics tracking, health checks, and background job processing via Redis.

## ✨ Features

- 🚀 **GraphQL API** - Type-safe query interface with Apollo Server
- 📊 **Query Statistics** - Automatic tracking of API usage patterns
- ⚡ **Job Queues** - Background processing with BullMQ and Redis
- 🏥 **Health Checks** - Comprehensive service monitoring
- 🔍 **Search & Pagination** - Efficient data retrieval
- 📝 **Type Safety** - Full TypeScript implementation

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API**: [GraphQL](https://graphql.org/) with Apollo Server
- **Queue**: [BullMQ](https://docs.bullmq.io/) with Redis
- **HTTP Client**: Axios
- **Validation**: class-validator & class-transformer
- **Health Checks**: Terminus

## 📦 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **Redis** >= 6.x

## 🚀 Installation

1. **Install dependencies**

```bash
pnpm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

3. **Start Redis** (if not running via Docker Compose)

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

## 🔐 Environment Variables

| Variable         | Required | Default                 | Description                 |
| ---------------- | -------- | ----------------------- | --------------------------- |
| `PORT`           | No       | `3000`                  | Server port                 |
| `NODE_ENV`       | Yes      | `development`           | Environment mode            |
| `CORS_ORIGIN`    | Yes      | -                       | Allowed CORS origins        |
| `SWAPI_BASE_URL` | Yes      | `https://swapi.dev/api` | Star Wars API endpoint      |
| `SWAPI_TIMEOUT`  | No       | `10000`                 | API timeout in milliseconds |
| `REDIS_HOST`     | No       | `localhost`             | Redis host                  |
| `REDIS_PORT`     | No       | `6379`                  | Redis port                  |

## 🏃 Running the Application

### Development Mode

```bash
pnpm run start:dev
```

Server runs at `http://localhost:3000` with hot-reload enabled.

### Production Mode

```bash
pnpm run build
pnpm run start:prod
```

### Debug Mode

```bash
pnpm run start:debug
```

## 📖 GraphQL API

Access GraphQL Playground at `http://localhost:3000/graphql`

### Example Queries

**Get Characters**

```graphql
query {
  characters(page: 1, search: "luke") {
    count
    results {
      id
      name
      height
      gender
    }
  }
}
```

**Get Single Character**

```graphql
query {
  character(id: "1") {
    id
    name
    films
    starships
  }
}
```

**Get Planets**

```graphql
query {
  planets(page: 1, search: "tatooine") {
    count
    results {
      id
      name
      climate
      terrain
      population
    }
  }
}
```

**Get Starships**

```graphql
query {
  starships(page: 1, search: "x-wing") {
    count
    results {
      id
      name
      model
      manufacturer
      starship_class
    }
  }
}
```

**Get Statistics**

```graphql
query {
  statistics {
    totalQueries
    averageResponseTime
    mostPopularHour
    topQueries {
      query
      count
      percentage
    }
  }
}
```

## 🏥 Health Checks

```bash
GET /health
```

Response includes status of API, SWAPI, and Redis services.

## 📊 Statistics

Query statistics are automatically tracked and recomputed every 5 minutes:

- Top 5 most frequently executed queries
- Average response time
- Total queries executed
- Most popular hour (0-23)
- Hourly distribution across 24 hours

## 📁 Project Structure

```
src/
├── config/           # Configuration management
├── health/           # Health check module
├── starwars/         # Star Wars API module
├── statistics/       # Statistics tracking module
├── utils/            # Utility functions
├── app.module.ts     # Root module
└── main.ts           # Entry point
```

## 🧪 Testing

```bash
pnpm run test          # Unit tests
pnpm run test:e2e      # End-to-end tests
pnpm run test:cov      # Coverage report
```

## 🔧 Available Scripts

| Script                 | Description                 |
| ---------------------- | --------------------------- |
| `pnpm run start`       | Production mode             |
| `pnpm run start:dev`   | Development with hot-reload |
| `pnpm run start:debug` | Debug mode                  |
| `pnpm run build`       | Build for production        |
| `pnpm run lint`        | Run ESLint                  |
| `pnpm run format`      | Format with Prettier        |
| `pnpm run test`        | Unit tests                  |

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [SWAPI](https://swapi.dev/) - The Star Wars API
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL implementation

---

Made with ❤️ using NestJS
