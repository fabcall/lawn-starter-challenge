# 🌟 Star Wars Universe Explorer

A full-stack web application for exploring the vast Star Wars universe. Discover characters, planets, and starships from the legendary saga using a modern, responsive interface powered by GraphQL.

## 🎯 Overview

Star Wars Universe Explorer is a monorepo project that combines a powerful backend API with an engaging frontend interface. The application consumes data from the Star Wars API (SWAPI) and presents it through a GraphQL layer with real-time statistics tracking and optimized data caching.

## 🛠 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) v11 - Progressive Node.js framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **API**: [GraphQL](https://graphql.org/) with Apollo Server - Flexible query language
- **Queue**: [BullMQ](https://docs.bullmq.io/) with Redis - Background job processing
- **HTTP Client**: Axios - Promise-based HTTP client
- **Validation**: class-validator & class-transformer - Data validation
- **Health Checks**: Terminus - Readiness and liveness checks

### Frontend
- **Framework**: [React](https://react.dev) v19 - UI library
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **State Management**: [Apollo Client](https://www.apollographql.com/docs/react) - GraphQL client
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 - Utility-first CSS
- **Routing**: [React Router](https://reactrouter.com/) v7 - Client-side routing
- **Build Tool**: [Vite](https://vitejs.dev/) v7 - Next generation frontend tooling

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **Redis** >= 6.x (for job queues)
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd star-wars-universe-explorer
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create `.env` files for both backend and frontend:

#### Backend (`.env`)
```bash
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
SWAPI_BASE_URL=https://swapi.dev/api
SWAPI_TIMEOUT=10000
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Frontend (`.env`)
Frontend uses the proxy configured in `vite.config.ts` to communicate with the backend.

### 4. Start Redis

#### Using Docker (Recommended)
```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

#### Using Homebrew (macOS)
```bash
brew install redis
brew services start redis
```

#### Using apt (Ubuntu/Debian)
```bash
sudo apt install redis-server
sudo systemctl start redis
```

### 5. Run the Application

#### Development Mode (with Docker Compose)

```bash
docker-compose -f docker-compose.dev.yml up
```

This will start:
- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Frontend**: http://localhost:5173
- **Redis**: localhost:6379

#### Local Development (without Docker)

Terminal 1 - Start Redis:
```bash
# Already started in step 4
```

Terminal 2 - Start Backend:
```bash
cd backend
pnpm install
pnpm run start:dev
```

Terminal 3 - Start Frontend:
```bash
cd frontend
pnpm install
pnpm run dev
```

## 📖 Project Structure

```
star-wars-universe-explorer/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── health/            # Health check module
│   │   ├── starwars/          # Star Wars API module
│   │   ├── statistics/        # Statistics tracking module
│   │   ├── utils/             # Utility functions
│   │   └── main.ts            # Entry point
│   ├── test/                  # Test files
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and GraphQL setup
│   │   ├── pages/             # Page components
│   │   ├── routes/            # Route configuration
│   │   ├── types/             # TypeScript types
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml         # Production compose file
├── docker-compose.dev.yml     # Development compose file
└── README.md                  # This file
```

## 🎮 Using the Application

### Homepage
The homepage provides an overview of the application with quick links to browse Characters, Planets, and Starships.

### Browsing Content

1. **Characters** - Explore heroes and villains from across the saga
2. **Planets** - Discover worlds from desert planets to ice worlds
3. **Starships** - View iconic vessels and their specifications

Each section features:
- Search functionality with debouncing
- Pagination for efficient data loading
- Detailed view pages for each entity
- Related information and statistics

## 📊 GraphQL API

Access the GraphQL Playground at `http://localhost:3000/graphql` in development mode.

### Example Queries

#### Get Characters
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

#### Get Planets
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

#### Get Statistics
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

Monitor application health at `http://localhost:3000/health`

```bash
GET /health
```

Response includes status of:
- API service
- SWAPI connectivity
- Redis connection

## 🧪 Testing

### Backend Tests
```bash
cd backend
pnpm run test              # Unit tests
pnpm run test:e2e          # End-to-end tests
pnpm run test:cov          # Coverage report
```

### Frontend Tests
```bash
cd frontend
pnpm run test              # Run tests
```

## 📦 Production Deployment

### Build Production Images

```bash
docker-compose build
docker-compose up -d
```

### Local Production Build

#### Backend
```bash
cd backend
pnpm run build
pnpm run start:prod
```

#### Frontend
```bash
cd frontend
pnpm run build
pnpm run preview
```

## 🔧 Available Scripts

### Backend
- `pnpm run start` - Start in production mode
- `pnpm run start:dev` - Development mode with hot reload
- `pnpm run start:debug` - Debug mode
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run E2E tests

### Frontend
- `pnpm run dev` - Development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run test` - Run tests

## 🌐 API Endpoints

### Health
- `GET /health` - Complete health check

### GraphQL
- `POST /graphql` - GraphQL endpoint
- `GET /graphql` - GraphQL Playground (development)

## 📝 Environment Configuration

### Supported Variables

#### Backend
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | development | Environment mode |
| `PORT` | No | 3000 | Server port |
| `CORS_ORIGIN` | Yes | - | Allowed CORS origins |
| `SWAPI_BASE_URL` | Yes | https://swapi.dev/api | Star Wars API endpoint |
| `SWAPI_TIMEOUT` | No | 10000 | API timeout in ms |
| `REDIS_HOST` | No | localhost | Redis host |
| `REDIS_PORT` | No | 6379 | Redis port |

## 🤝 Contributing

This is a learning project. Feel free to explore and modify the code to understand how modern full-stack applications work.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [SWAPI](https://swapi.dev/) - The Star Wars API
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://react.dev) - UI library
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL implementation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

For issues and questions:
1. Check existing documentation in backend and frontend README files
2. Review GraphQL schema in the Playground
3. Check application logs for error details

---

Made with ❤️ using NestJS and React

May the Force be with you! ⭐