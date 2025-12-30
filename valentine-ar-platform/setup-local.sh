#!/bin/bash
set -e

echo "🚀 Valentine AR Platform - Local Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Node.js and pnpm
echo "1️⃣ Checking prerequisites..."
node --version || { echo "❌ Node.js not found. Install from https://nodejs.org"; exit 1; }
pnpm --version || { echo "❌ pnpm not found. Run: npm install -g pnpm"; exit 1; }
echo -e "${GREEN}✅ Node.js and pnpm installed${NC}"
echo ""

# 2. Setup PostgreSQL
echo "2️⃣ Setting up PostgreSQL..."
if docker ps >/dev/null 2>&1; then
  echo "Docker is running. Setting up PostgreSQL container..."

  # Stop existing container if any
  docker rm -f valentine-postgres 2>/dev/null || true

  # Run PostgreSQL container
  docker run --name valentine-postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=valentine_ar \
    -p 5432:5432 \
    -d postgres:15

  echo -e "${GREEN}✅ PostgreSQL container started${NC}"
  echo "   Connection: postgresql://postgres:password@localhost:5432/valentine_ar"

  # Wait for PostgreSQL to be ready
  echo "   Waiting for PostgreSQL to be ready..."
  sleep 3
else
  echo -e "${YELLOW}⚠️  Docker not running. Please:"
  echo "   Option A: Start Docker and run this script again"
  echo "   Option B: Install PostgreSQL manually and create 'valentine_ar' database${NC}"
  echo ""
  read -p "Do you have PostgreSQL running locally? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
echo ""

# 3. Create .env file
echo "3️⃣ Creating .env file..."
if [ -f .env ]; then
  echo -e "${YELLOW}⚠️  .env already exists. Backing up to .env.backup${NC}"
  cp .env .env.backup
fi

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/valentine_ar"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

# OAuth Providers (optional in development)
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Polar Payment (optional in development)
# POLAR_ACCESS_TOKEN="polar_at_..."
# POLAR_WEBHOOK_SECRET="whsec_..."

# Public URL
NEXT_PUBLIC_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
EOF

echo -e "${GREEN}✅ .env file created${NC}"
echo ""

# 4. Install dependencies
echo "4️⃣ Installing dependencies..."
pnpm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# 5. Setup database
echo "5️⃣ Setting up database schema..."
pnpm prisma db push
echo -e "${GREEN}✅ Database schema created${NC}"
echo ""

# 6. Optional: Seed database
echo "6️⃣ Seeding database (optional)..."
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -f prisma/seed.ts ]; then
    pnpm db:seed
    echo -e "${GREEN}✅ Database seeded${NC}"
  else
    echo -e "${YELLOW}⚠️  Seed file not found, skipping...${NC}"
  fi
fi
echo ""

# 7. Build check
echo "7️⃣ Verifying build..."
pnpm build
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Done!
echo "======================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start development server:"
echo -e "  ${YELLOW}pnpm dev${NC}"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  pnpm dev          - Start development server"
echo "  pnpm build        - Build for production"
echo "  pnpm db:studio    - Open Prisma Studio (database UI)"
echo "  pnpm db:push      - Sync database schema"
echo ""
echo "Database info:"
echo "  URL: postgresql://postgres:password@localhost:5432/valentine_ar"
echo "  To stop: docker stop valentine-postgres"
echo "  To start: docker start valentine-postgres"
echo ""
