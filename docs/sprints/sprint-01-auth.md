# SPRINT 01: Cimientos, Seguridad y Auth 🏗️🔐

**Duración:** 1 semana (5 días hábiles)
**Objetivo:** Configurar el repositorio, pipeline de tests (90%) y sistema de autenticación multi-tenant completo.

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Cobertura de tests ≥ 90%
- ✅ Todos los tests pasan en CI
- ✅ Linter sin warnings
- ✅ Autenticación funcional end-to-end
- ✅ RLS policies implementadas y testeadas

---

## 🎯 TAREAS DETALLADAS

### **DÍA 1: Setup del Proyecto**

#### Tarea 1.1: Inicializar Monorepo
- Configurar `npm workspaces`.
- Instalar dependencias raíz (`eslint`, `prettier`, `husky`).
- Configurar scripts de desarrollo (`dev`, `build`, `test`).

#### Tarea 1.2: Configurar Backend (Express)
- Estructura de carpetas (`src/controllers`, `src/services`, etc.).
- Configurar TypeScript (`tsconfig.json`).
- Configurar Vitest + Supertest.
- Implementar `app.ts` y `server.ts` básicos.
- Configurar Middleware de Error y Logger (Pino).

#### Tarea 1.3: Configurar Frontend (Vite + React)
- Inicializar Vite con SWC + TypeScript.
- Configurar TailwindCSS + Shadcn/ui.
- Configurar Router (`react-router-dom`).
- Configurar cliente HTTP (`axios` o `fetch` wrapper).

---

### **DÍA 2: Base de Datos & Supabase**

#### Tarea 2.1: Schema Inicial
- Crear tablas:
    - `organizations`
    - `users`
    - `organization_members`
- Definir RLS (Row Level Security) policies.
- Crear SQL de migraciones.

#### Tarea 2.2: Conexión Backend
- Cliente Supabase (`@supabase/supabase-js`).
- Variables de entorno (`.env`).

---

### **DÍA 3: Authentication (Backend)**

#### Tarea 3.1: Auth Service & Controller
- `POST /auth/register`: Registro de usuario y organización.
- `POST /auth/login`: Login con validación de password (bcrypt).
- Generación de JWT.

#### Tarea 3.2: Auth Middleware
- Validar JWT en headers.
- Inyectar usuario y organización en `req`.

#### Tarea 3.3: Tests de Auth
- Units tests para `AuthService`.
- Integration tests para endpoints de Auth.

---

### **DÍA 4: Authentication (Frontend)**

#### Tarea 4.1: Auth Store / Context
- Implementar Zustand store para manejar estado de sesión.
- Persistencia de token en localStorage/cookies.

#### Tarea 4.2: Páginas de Login/Register
- Formulario de Login (Zod validation).
- Formulario de Registro (Nombre, Email, Password, Org).

#### Tarea 4.3: Rutas Protegidas
- Componente `<ProtectedRoute />`.
- Redirección si no está autenticado.

---

### **DÍA 5: CI/CD & E2E**

#### Tarea 5.1: GitHub Actions
- Workflow de CI: Lint, Build, Test (Backend & Frontend).
- Block merge on failure.

#### Tarea 5.2: Tests E2E (Playwright)
- Testear flujo completo: Registro -> Login -> Dashboard.
- Testear logout.

---

## ✅ CHECKLIST DE CIERRE

- [ ] Repositorio e infraestructura listos.
- [ ] Base de datos migrada correctamente.
- [ ] API de autenticación documentada y testeada.
- [ ] Frontend integrado con API.
- [ ] CI/CD pipeline verde.
