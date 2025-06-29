# Job Board

A job board project fullstack built with NestJS, React, and MongoDB, containerized with Docker for easy development and deployment.

## Features

- **Backend**: NestJS with TypeScript
- **Frontend**: React with Vite
- **Database**: MongoDB (with PostgreSQL configuration available)
- **Development**: Hot-reloading for both frontend and backend
- **Monorepo**: Managed with pnpm workspaces

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (v20 or later) & Docker Compose
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:viet34tqc/base-vite-nestjs.git
   cd base-vite-nestjs
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

## Development

### Using Docker

```bash
pnpm docker:dev
```

This will start:

- Frontend dev server: `http://localhost:5173`
- Backend server: `http://localhost:3000`
- MongoDB: `27017`

### Update database schema

- Copy .env into `packages/server/.env`
- Change the mongo from `mongo` to `localhost` in DATABASE_URL: "mongodb://root:admin123@localhost:27017/mydb?authSource=admin"
- Run `cd packages/server && npx prisma db push`

## Project Structure

```text
.
├── docker/                    # Docker configuration files
│   ├── docker-compose.dev.yml  # Development environment
│   └── docker-compose.prod.yml # Production environment
├── packages/
│   ├── client/               # React frontend
│   │   ├── src/              # Source files
│   │   ├── index.html        # Main HTML template
│   │   └── vite.config.ts    # Vite configuration
│   ├── server/               # NestJS backend
│   │   ├── src/
│   │   │   ├── app/        # Application code
│   │   │   └── main.ts      # Application entry point
│   │   └── prisma/          # Database schema and migrations
│   └── shared/               # Shared types and interfaces
└── README.md                 # This file
```
