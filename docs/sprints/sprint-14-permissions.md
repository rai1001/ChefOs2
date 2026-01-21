# SPRINT 14: Sistema de Permisos Granulares 🔐

**Duración:** 1 semana
**Objetivo:** Implementar RBAC avanzado con permisos detallados por recurso y acción.

---

## 🎯 ARQUITECTURA

### Migración: Advanced Permissions
- Types: `resource_type` (ingredients, recipes, etc.), `action_type` (create, read, etc.), `organization_role` (ORG_ADMIN, HEAD_CHEF, etc.).
- `role_permissions`: Tabla pivote para definir matrices de acceso.
- RPC `check_permission`: Función central validadora (usa `dblink` o joins directos a `organization_members` y `role_permissions`).
- Seed Data: Permisos predefinidos para roles estándar (e.g. `COOK` solo lee recetas y actualiza tareas).

### Backend - Authorization
- `requirePermission`: Middleware que verifica permisos antes de ejecutar el controlador.
- Integración en RLS: Policies que llaman a `check_permission` para filtrar filas a nivel DB.

### Frontend - Access Control
- Hook `usePermissions`: Carga permisos del usuario al inicio (cacheado).
- Componente `ProtectedAction`: Wrapper que oculta/deshabilita elementos UI si no hay permiso (e.g., botón "Eliminar").

---

## ✅ DEFINITION OF DONE

- [ ] Esquema de permisos migrado
- [ ] Roles definidos y asignados
- [ ] Middleware de permisos implementado y testeado
- [ ] RLS policies actualizadas con lógica granular
- [ ] Hook de permisos integrado en el frontend
- [ ] Auditoría de seguridad (intentar acciones prohibidas)
