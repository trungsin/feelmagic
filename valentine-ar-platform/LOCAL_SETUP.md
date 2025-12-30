# 🚀 Local Development Setup

Quick guide để chạy Valentine AR Platform trên máy local.

## Option 1: Auto Setup (Recommended)

Chạy script tự động setup tất cả:

```bash
./setup-local.sh
```

Script sẽ:
- ✅ Check Node.js và pnpm
- ✅ Setup PostgreSQL container (Docker)
- ✅ Tạo .env file với NEXTAUTH_SECRET ngẫu nhiên
- ✅ Install dependencies
- ✅ Setup database schema
- ✅ Optional: Seed sample data
- ✅ Verify build

**Sau khi setup xong:**

```bash
pnpm dev
```

Mở browser: http://localhost:3000

---

## Option 2: Manual Setup

### 1. Prerequisites

```bash
# Check versions
node --version  # Should be 18+
pnpm --version  # Should be 8+
```

### 2. PostgreSQL Setup

**Option A: Docker (Recommended)**

```bash
docker run --name valentine-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=valentine_ar \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Native Install (macOS)**

```bash
brew install postgresql@15
brew services start postgresql@15
createdb valentine_ar
```

### 3. Environment Variables

```bash
# Copy example
cp .env.example .env

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

Edit `.env`:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/valentine_ar"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<paste-generated-secret>"
NEXT_PUBLIC_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Install & Setup

```bash
# Install dependencies
pnpm install

# Setup database
pnpm prisma db push

# Optional: Seed sample data
pnpm db:seed

# Verify build
pnpm build
```

### 5. Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000

---

## 📋 Useful Commands

### Development

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database

```bash
pnpm db:push      # Sync schema to database
pnpm db:studio    # Open Prisma Studio (database UI)
pnpm db:seed      # Seed sample data
```

### Docker PostgreSQL

```bash
docker ps                        # Check if running
docker stop valentine-postgres   # Stop database
docker start valentine-postgres  # Start database
docker logs valentine-postgres   # View logs
docker rm -f valentine-postgres  # Remove container
```

---

## 🔐 Create Admin User

### Option 1: Via Prisma Studio

```bash
pnpm db:studio
```

1. Navigate to `User` table
2. Click "Add record"
3. Fill in:
   - id: `admin-1`
   - email: `admin@example.com`
   - name: `Admin User`
   - role: `ADMIN`
4. Save

### Option 2: Via SQL

```sql
INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
VALUES (
  'admin-1',
  'admin@example.com',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);
```

---

## 🎯 What Works in Local Dev

### ✅ Working Features

- Landing page & template marketplace
- Template browsing & detail pages
- Admin panel (dashboard, templates, orders, users)
- Card customization builder
- AR viewer with camera & effects
- Gesture detection (MediaPipe)
- Voice commands (Web Speech API)

### ⚠️ Needs Configuration

**Google OAuth (Optional):**
- Get credentials from [Google Cloud Console](https://console.cloud.google.com)
- Add to `.env`:
  ```
  GOOGLE_CLIENT_ID="your-client-id"
  GOOGLE_CLIENT_SECRET="your-client-secret"
  ```

**Polar Payment (Optional):**
- Currently using mock checkout
- To enable real payments:
  - Get Polar credentials
  - Add to `.env`:
    ```
    POLAR_ACCESS_TOKEN="polar_at_..."
    POLAR_WEBHOOK_SECRET="whsec_..."
    ```

---

## 📱 Testing AR Features

AR features work best on:
- **Desktop:** Chrome, Edge (WebGL + MediaPipe)
- **Mobile:** Chrome, Safari (camera access required)

**Permissions needed:**
- Camera access (for AR viewer)
- Microphone access (for voice commands)

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep valentine-postgres

# Restart if needed
docker restart valentine-postgres

# Check logs
docker logs valentine-postgres
```

### Port 3000 Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Prisma Client Out of Sync

```bash
# Regenerate Prisma client
pnpm prisma generate

# Push schema again
pnpm prisma db push
```

### Build Errors

```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm build
```

---

## 📚 Project Structure

```
valentine-ar-platform/
├── prisma/              # Database schema
│   └── schema.prisma
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (marketing)/    # Public pages
│   │   ├── (admin)/         # Admin panel
│   │   ├── (builder)/       # Customization
│   │   ├── (viewer)/        # AR viewer
│   │   └── api/             # API routes
│   ├── components/     # React components
│   ├── ar-engine/      # AR engine modules
│   └── lib/            # Utilities
├── .env                # Environment variables
└── package.json        # Dependencies
```

---

## 🔗 Quick Links

- Dev Server: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Prisma Studio: Run `pnpm db:studio`
- API Routes: http://localhost:3000/api/*

---

## 📝 Notes

- OAuth & Polar are **optional** for local development
- Checkout uses **mock payment** without Polar credentials
- AR features require **HTTPS in production** (getUserMedia)
- Environment validation will warn about missing optional vars

---

## ✅ Ready to Develop!

After setup:

1. Start dev server: `pnpm dev`
2. Open http://localhost:3000
3. Create admin user (if needed)
4. Access admin panel: http://localhost:3000/admin
5. Start coding! 🚀

For production deployment, see `/plans/reports/project-complete-251229-1351-valentine-ar-platform.md`
