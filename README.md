# SkillMate (A Skillbarter platform where users can exchange skills instead of money)

A full‑stack website built with React + Vite on the client and Express on the server, using MongoDB for data.
It includes a production server that serves the built SPA and an API, plus a Netlify serverless setup for easy hosting.

## Highlights
- Vite + React + TypeScript with Tailwind CSS and shadcn/ui (Radix) components
- Express API with security middleware (helmet, rate limiting, compression, CORS)
- MongoDB with automatic index creation and basic seed data
- Unified local dev: Vite serves the SPA and mounts the Express API as middleware
- Flexible deploy: traditional Node server or Netlify Functions

## Tech Stack
- Client: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router
- Server: Express 5, pino logging, zod validation
- DB: MongoDB (official Node driver)
- Tooling: Vitest, Prettier

## Project Structure
```
.
├─ client/                 # React app (SPA)
│  ├─ components/          # UI components (includes shadcn/ui primitives)
│  ├─ hooks/               # React hooks
│  ├─ lib/                 # Client utilities & API helpers
│  ├─ pages/               # Route pages
│  ├─ App.tsx              # App entry
│  └─ global.css           # Tailwind styles
├─ server/                 # Express server
│  ├─ db/                  # MongoDB client & bootstrap (indexes, seeding)
│  ├─ routes/              # API route handlers (auth, users, posts, calls, demo)
│  ├─ env.ts               # Env schema & helpers
│  ├─ index.ts             # createServer() mounting routes & middleware
│  └─ node-build.ts        # Production server serving SPA + API
├─ shared/                 # Shared types (exposed to client and server)
├─ netlify/functions/      # Netlify serverless function (wraps Express)
├─ public/                 # Static assets
├─ vite.config.ts          # Vite (dev + SPA build)
├─ vite.config.server.ts   # Vite server bundle (node-build.ts)
├─ netlify.toml            # Netlify build & redirects (/api/* → functions)
├─ tailwind.config.ts      # Tailwind config
├─ tsconfig.json           # TS config (paths: @/* and @shared/*)
└─ package.json            # Scripts & dependencies
```

## Requirements
- Node.js 20+ (server bundle targets Node 22)
- MongoDB database

## Environment Variables
Define these in your environment (for local development use a .env file in the repository root):
- MONGODB_URI: MongoDB connection string
- DB_NAME: Database name (defaults to "skillmate" if not set in code)



## Install
Using pnpm:
- pnpm install


## Development
Start the Vite dev server (serves SPA on http://localhost:8080 and mounts the Express API):
- pnpm dev

Useful scripts:
- pnpm test           # Run Vitest
- pnpm typecheck      # TypeScript checks
- pnpm format.fix     # Prettier

## Build
Build both client and server:
- pnpm build

Or individually:
- pnpm build:client   # Builds SPA to dist/spa
- pnpm build:server   # Builds server bundle to dist/server

Run the production server after building (serves SPA and API on the same port):
- pnpm start

## API Overview
Base URL in development: same origin as the dev server (Vite mounts Express). In production (Node server), base URL is the server host.

Health:
- GET /healthz → "ok"
- GET /readyz → { status, env }

Demo:
- GET /api/demo → simple message

Auth:
- POST /api/auth/signup → { name, email, password }
- POST /api/auth/login  → { email, password }
- POST /api/auth/logout → stateless ok
- POST /api/auth/signout → { email, password } deletes user

Users:
- GET /api/users/me?email=... → user profile (without passwordHash)
- PUT /api/users/me → { email, updates } to patch profile fields
- GET /api/users/stats?email=... → basic stats
- GET /api/users/by-name?name=... → lookup by name

Posts:
- GET /api/posts?search=&category=&type=all|teach|learn|exchange → list with filters
- POST /api/posts → create post (see server/routes/posts.ts for fields)
- POST /api/posts/:id/like → body { userEmail } increments likes
- POST /api/posts/:id/respond → increments responses

WebRTC Signaling (in‑memory for demos):
- POST /api/calls/initiate
- GET  /api/calls/pending
- POST /api/calls/accept
- POST /api/calls/decline
- POST /api/calls/end
- POST /api/calls/offer,  GET /api/calls/offer
- POST /api/calls/answer, GET /api/calls/answer
- POST /api/calls/candidate, GET /api/calls/candidates
- GET  /api/calls/state

## Database Notes
On first connection, the server will:
- Create indexes for users and posts collections
- Seed sample posts if the posts collection is empty


### Traditional Node server or Docker
- Build with pnpm build
- Start with pnpm start (serves SPA from dist/spa and API on the same port)
- Ensure environment variables are set in the target environment

