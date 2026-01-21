# SPRINT 02: Ingredientes y Familias 🥕📦

**Duración:** 1 semana (5 días hábiles)
**Objetivo:** Implementar la gestión de catálogo base: familias de productos e ingredientes, con gestión de unidades y alertas de stock.

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Cobertura de tests ≥ 90%
- ✅ Migraciones de unidades y familias aplicadas
- ✅ CRUD de familias implementado y testeado
- ✅ CRUD de ingredientes implementado y testeado
- ✅ Safety Buffer por familia funcional
- ✅ Sistema de stock mínimo funcional
- ✅ Frontend de ingredientes completo

---

## 🎯 TAREAS DETALLADAS

### **DÍA 1: Base de Datos & Familias Backend**

#### Tarea 1.1: Migraciones y Seeders
- Crear migraciones para `units`, `product_families`, `ingredients`.
- Crear seed para `units` (kg, g, l, ml, u).

#### Tarea 1.2: CRUD Product Families
- Controller: `ProductFamiliesController`
- Endpoints: GET, POST, PATCH, DELETE (soft).
- Validaciones: Safety Buffer > 1.0.

---

### **DÍA 2: Ingredientes Backend**

#### Tarea 2.1: CRUD Ingredients
- Controller: `IngredientsController`
- Endpoints: GET (filtros), POST, PATCH, DELETE.
- Relaciones: `supplier_id`, `product_family_id`.
- Campos calculados: `last_cost_update`.

#### Tarea 2.2: Lógica de Stock
- Endpoint: `GET /ingredients/low-stock`.
- Service method: `checkLowStock()`.

---

### **DÍA 3: Frontend Services & Hooks**

#### Tarea 3.1: Services
- `ingredients.service.ts`
- `product-families.service.ts`

#### Tarea 3.2: Hooks (React Query)
- `useIngredients`, `useIngredient`, `useCreateIngredient`.
- `useProductFamilies`.

---

### **DÍA 4: Frontend UI (Listados)**

#### Tarea 4.1: Página de Ingredientes
- Tabla con filtros y paginación.
- Badges para stock bajo.

#### Tarea 4.2: Formularios
- Modal/Página para crear/editar ingrediente.
- Selectores dinámicos para Familia y Unidad.

---

### **DÍA 5: Tests & CI**

#### Tarea 5.1: Backend Tests
- Integration tests para familias e ingredientes.
- Test de validación de safety buffer.

#### Tarea 5.2: Frontend Tests
- Renderizado de lista.
- Formulario de creación.

---

## ✅ DEFINITION OF DONE

- [ ] Migraciones de unidades y familias aplicadas
- [ ] CRUD de familias implementado y testeado (≥90% coverage)
- [ ] CRUD de ingredientes implementado y testeado (≥90% coverage)
- [ ] Safety Buffer por familia funcional
- [ ] Sistema de stock mínimo implementado
- [ ] Endpoint de low-stock funcional
- [ ] Frontend de ingredientes completo
- [ ] Tests E2E de flujo completo
- [ ] CI passing
- [ ] Documentación actualizada
