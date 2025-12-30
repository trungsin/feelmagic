# Admin Panel - Quick Reference

## Access
- URL: `/admin`
- Auth: NextAuth.js v5
- Role: `ADMIN` required

## Pages

### Dashboard (`/admin`)
- Revenue stats
- Orders count
- Templates count
- Users count
- Recent orders (10 latest)

### Templates (`/admin/templates`)
- List all templates
- Create new template (`/admin/templates/new`)
- Edit template (`/admin/templates/[id]`)
- Delete template (with protection)
- Toggle active status

### Orders (`/admin/orders`)
- List all orders
- Filter by status (PENDING, PAID, FAILED, REFUNDED)
- Pagination (50/page)
- Customer info display

### Users (`/admin/users`)
- List all users
- Change user role (USER ↔ ADMIN)
- Self-demotion prevention
- User stats (orders, cards)

## API Routes

### Templates
- `GET /api/admin/templates` - List all
- `POST /api/admin/templates` - Create
- `GET /api/admin/templates/[id]` - Get one
- `PUT /api/admin/templates/[id]` - Update
- `DELETE /api/admin/templates/[id]` - Delete
- `PATCH /api/admin/templates/[id]` - Toggle active

### Orders
- `GET /api/admin/orders?status=PAID&page=1&limit=50` - List with filters

### Users
- `GET /api/admin/users` - List all
- `PUT /api/admin/users/[id]` - Update role

### Dashboard
- `GET /api/admin/dashboard` - Stats

## First Time Setup

### 1. Create Admin User
```sql
-- Run in Prisma Studio or psql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 2. Create Sample Template
```bash
curl -X POST http://localhost:3000/api/admin/templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Valentine Hearts AR",
    "description": "Romantic AR card with floating hearts",
    "price": 9.99,
    "previewImage": "https://example.com/preview.jpg",
    "previewVideo": "",
    "polarProductId": "",
    "availableEffects": ["hearts", "sparkles"],
    "availableMusic": ["romantic1.mp3"],
    "isActive": true,
    "sortOrder": 0
  }'
```

## Development

### Run Dev Server
```bash
cd valentine-ar-platform
npm run dev
```

### Type Check
```bash
npm run typecheck
# or
npx tsc --noEmit
```

### Build
```bash
npm run build
```

## Tech Stack
- Next.js 15 App Router
- NextAuth.js v5 (beta)
- Prisma ORM
- PostgreSQL
- TailwindCSS
- Radix UI (toast, dialog, select)
- React Hook Form + Zod
- TypeScript strict mode

## File Structure
```
src/
├── app/
│   ├── (admin)/admin/          # Admin pages
│   │   ├── layout.tsx          # Protected layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── templates/          # Templates CRUD
│   │   ├── orders/             # Orders list
│   │   └── users/              # Users management
│   └── api/admin/              # Admin API routes
│       ├── dashboard/
│       ├── templates/
│       ├── orders/
│       └── users/
├── components/
│   ├── admin/                  # Admin components
│   │   ├── admin-sidebar.tsx
│   │   ├── stats-card.tsx
│   │   ├── recent-orders.tsx
│   │   ├── templates-table.tsx
│   │   ├── template-form.tsx
│   │   ├── orders-table.tsx
│   │   └── users-table.tsx
│   └── ui/                     # UI primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── dialog.tsx
│       └── select.tsx
├── lib/
│   ├── auth-middleware.ts      # Auth helpers
│   ├── validations/
│   │   └── admin.ts            # Zod schemas
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma client
│   └── utils.ts                # Utilities
└── hooks/
    └── use-toast.ts            # Toast hook
```

## Security

### Route Protection
- Pages: `requireAdmin()` function
- API: `requireAdminAPI()` function
- Auto-redirect if not authenticated/admin

### Input Validation
- All forms use Zod schemas
- Server-side validation on API routes
- Type-safe with TypeScript

### Safety Features
- Self-demotion prevention (users can't demote themselves)
- Delete protection (templates with orders can't be deleted)
- Confirmation dialogs for destructive actions

## Troubleshooting

### "Unauthorized" error
- Check user role in database
- Verify NextAuth session
- Clear cookies and re-login

### "Failed to fetch" errors
- Check API route is running
- Verify network requests in DevTools
- Check server logs for errors

### TypeScript errors
```bash
npx tsc --noEmit
```

### Build errors
```bash
rm -rf .next
npm run build
```

## Production Checklist
- [ ] Set `ADMIN` role for at least 1 user
- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Test all CRUD operations
- [ ] Verify mobile responsive
- [ ] Check security headers
- [ ] Test error scenarios

## Support
- GitHub Issues
- Documentation: /docs
- Email: support@example.com
