# ChefOS Architecture & Project Structure

## 🏗️ Tech Stack

### Backend
- **Framework:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth + Custom JWT Middleware
- **Storage:** Supabase Storage
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Pino
- **Testing:** Vitest + Supertest

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS + Shadcn/ui
- **State Management:** Zustand (Auth) + React Query (Server state)
- **Forms:** React Hook Form + Zod
- **Routing:** React Router DOM
- **Testing:** Vitest + React Testing Library + Playwright (E2E)

### Infrastructure / DevOps
- **Hosting:** Vercel (Frontend), Supabase Functions (Backend)
- **CI/CD:** GitHub Actions
- **Package Manager:** npm (Workspaces)

---

## 📂 Project Structure (Monorepo)

```text
/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # Shared types
│   └── tests/              # Unit & Integration tests
│
├── frontend/                # React App
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom Hooks
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Route pages
│   │   └── services/       # API clients
│   └── tests/              # End-to-end tests
│
└── supabase/               # Database
    ├── migrations/         # SQL Migrations
    └── seed.sql           # Seed data
```

---

## 🗄️ Database Schema (Core)

### Organizations (`organizations`)
- `id`: UUID (PK)
- `name`: String
- `slug`: String (Unique)
- `plan`: Enum (FREE, PRO, ENTERPRISE)

### Users (`users`)
- `id`: UUID (PK)
- `email`: String (Unique)
- `password_hash`: String
- `role`: Enum (OWNER, ADMIN, CHEF, STAFF)

### Organization Members (`organization_members`)
- Links Users to Organizations
- Many-to-Many relationship

---

## 🔐 Security & Auth

1. **Authentication:**
   - JWT-based auth flow
   - Passwords hashed with bcrypt
   - Supabase Auth integration

2. **Authorization:**
   - **RLS (Row Level Security):** All tables have RLS enabled.
   - **Tenancy:** Data is isolated by `organization_id`.
   - **Middleware:** `authMiddleware` verifies tokens and injects user context.

3. **Validation:**
   - Strict Zod schemas for all API inputs.
   - Typed responses.
