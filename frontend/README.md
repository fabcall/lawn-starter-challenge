# 🚀 Star Wars Universe Explorer - Frontend

A modern React application for exploring the Star Wars universe. Built with React 19, TypeScript, Tailwind CSS, and Apollo Client for GraphQL.

## 🛠 Tech Stack

- **React** 19 - UI library
- **TypeScript** - Type-safe development
- **Vite** 7 - Lightning-fast build tool
- **Apollo Client** - GraphQL client
- **React Router** 7 - Client-side routing
- **Tailwind CSS** 4 - Utility-first styling
- **Lucide Icons** - Icon library

## 📦 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
pnpm run build
```

### 4. Preview Production Build

```bash
pnpm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── characters/      # Character-related components
│   ├── planets/         # Planet-related components
│   ├── starships/       # Starship-related components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── shared/          # Shared components
│   └── ui/              # UI components
├── hooks/               # Custom React hooks
├── lib/
│   ├── graphql/         # GraphQL queries and Apollo setup
│   └── utils/           # Utility functions
├── pages/               # Page components
├── routes/              # Route configuration
├── types/               # TypeScript types
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## 🔧 Available Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm run dev`     | Start development server with hot reload |
| `pnpm run build`   | Build for production                     |
| `pnpm run preview` | Preview production build locally         |
| `pnpm run lint`    | Run ESLint                               |
| `pnpm run test`    | Run tests                                |

## 🌐 API Configuration

The frontend communicates with the backend via GraphQL at `/graphql`. The proxy is configured in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/graphql': {
      target: 'http://api:3000',
      changeOrigin: true,
    },
  },
}
```

In development, requests to `/graphql` are proxied to the backend server.

## 📖 Features

- **Browse Characters** - Search and explore Star Wars characters
- **Discover Planets** - Find information about planets across the galaxy
- **Explore Starships** - Learn about iconic vessels
- **Search Functionality** - Debounced search across all entities
- **Pagination** - Efficient data loading with pagination
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Theme** - Star Wars-themed dark interface

## 🎨 Styling

The application uses Tailwind CSS v4 with a Star Wars theme:

- Primary colors: Yellow (#FCC800) and black
- Custom star field background
- Smooth animations and transitions
- Responsive grid layouts

## 🔗 Environment Setup

The frontend assumes the backend is running on `http://localhost:3000` (or proxied via Vite).

For Docker Compose setup, refer to the root README.md.

## 📝 Development Tips

- Hot Module Replacement (HMR) is enabled by default
- Use the Apollo Client DevTools browser extension for debugging
- TypeScript strict mode is enabled
- ESLint and Prettier are configured

## 🚢 Deployment

The frontend is containerized with Nginx for production. Build process:

```bash
pnpm run build
# Output: dist/ directory
```

The production Docker image serves the built files through Nginx.

## 📄 License

MIT License - see the LICENSE file for details

---

May the Force be with you! ⭐
