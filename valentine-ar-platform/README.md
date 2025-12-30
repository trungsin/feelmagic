# Valentine AR Greeting Cards Platform

Interactive AR Valentine greeting cards e-commerce platform với hand gesture và voice recognition.

## Features

### User Features
- 🛒 Browse và mua AR Valentine templates
- 🎨 Customize cards (names, message, background, music, effects)
- 🔗 Generate shareable links
- 👋 AR hand gesture interactions (wave, heart gesture)
- 🗣️ Voice triggers ("I love you", "Happy Valentine")
- ✨ Effects: heart particles, fireworks, glow, confetti

### Admin Features
- 📊 Dashboard với analytics
- ➕ Create/Edit/Delete AR templates
- 📦 Manage orders & users
- 💰 Revenue tracking

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **Payment:** Polar Payment SDK
- **AR Engine:** MediaPipe + React Three Fiber
- **UI:** TailwindCSS + shadcn/ui
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database
pnpm db:push

# Seed database (optional)
pnpm db:seed

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database Setup

```bash
# Push schema to database
pnpm db:push

# Open Prisma Studio
pnpm db:studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Public pages
│   ├── (admin)/           # Admin panel
│   ├── (builder)/         # Customization builder
│   ├── (viewer)/          # AR viewer
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── marketplace/      # Marketplace components
│   ├── builder/          # Builder components
│   └── ar/               # AR components
├── ar-engine/            # AR engine modules
│   ├── gesture/          # Gesture detection
│   ├── voice/            # Voice recognition
│   └── effects/          # Visual effects
└── lib/                  # Utilities & configs
    ├── prisma.ts         # Prisma client
    ├── auth.ts           # NextAuth config
    └── validations/      # Zod schemas
```

## Development Phases

- [x] **Phase 1:** Foundation (Next.js, DB, Auth)
- [ ] **Phase 2:** Admin Panel
- [ ] **Phase 3:** Marketplace + Checkout
- [ ] **Phase 4:** Customization Builder
- [ ] **Phase 5:** AR Engine
- [ ] **Phase 6:** Testing & Polish

## Documentation

Xem chi tiết tại `/plans/251228-1538-valentine-ar-platform/`:
- System Architecture
- Database Design
- API Design
- AR Engine Design
- Payment Integration
- Deployment Guide

## License

Private - All Rights Reserved
