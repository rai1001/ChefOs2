# SPRINT 05: Órdenes de Compra & Generación Automática 🛒

**Duración:** 1 semana (5 días hábiles)
**Objetivo:** Implementar sistema completo de órdenes de compra con generación automática desde eventos, aplicando Safety Buffer y agrupación por proveedor.

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Cobertura de tests ≥ 90%
- ✅ CRUD de órdenes de compra funcional
- ✅ Generación automática desde eventos
- ✅ Safety Buffer aplicado correctamente
- ✅ Agrupación por proveedor
- ✅ Integración con delivery estimator
- ✅ Estados de PO gestionados

---

## 🎯 TAREAS DETALLADAS

### **DÍA 1: Backend - CRUD de Purchase Orders**

#### Tarea 1.1: Controller de PO (`PurchaseOrdersController`)
- Methods: `getAll`, `getById`, `create`, `updateStatus`, `receiveItems`, `delete`.
- Endpoints implementados en `purchase-orders.routes.ts`.

#### Tarea 1.2: Lógica de Negocio
- Cálculo de totales automático.
- Transición de estados (DRAFT -> SENT -> RECEIVED/PARTIAL).
- Validación de stock al recibir items.

---

### **DÍA 2: Service de Generación Automática**

#### Tarea 2.1: `PurchaseOrderGeneratorService`
- Método `generateFromEvent(eventId)`.
- **Algoritmo:**
    1. Calcular demanda del evento con `DemandCalculatorService` (incluye safety buffer).
    2. Agrupar ingredientes por proveedor.
    3. Estimar fecha de entrega para cada proveedor (`DeliveryEstimatorService`).
    4. Crear POs en estado DRAFT.

#### Tarea 2.2: Endpoint de Generación
- `POST /events/:id/generate-purchase-orders`.
- Retorna resumen de POs generadas y status de stock.

---

### **DÍA 3: Database & Stock Functions**

#### Tarea 3.1: RPC Functions
- `increment_ingredient_stock(id, quantity)`
- `decrement_ingredient_stock(id, quantity)`
- `register_stock_movement(...)` - Para trazabilidad.

---

### **DÍA 4: Tests**

#### Tarea 4.1: Integration Tests (`purchase-order-generator.test.ts`)
- Verificar agrupación por proveedor.
- Verificar aplicación de Safety Buffer.
- Verificar cálculo de fecha estimada.

---

### **DÍA 5: Frontend UI**

#### Tarea 5.1: Página de Órdenes de Compra
- Tabla con estados coloreados (Badges).
- Detalle de PO con lista de items.
- Botón "Recibir Pedido" para actualizar stock.

---

## ✅ DEFINITION OF DONE

- [ ] CRUD de purchase orders completo (≥90% coverage)
- [ ] Generador automático desde eventos implementado
- [ ] Safety Buffer correctamente aplicado
- [ ] Agrupación por proveedor funcional
- [ ] Integración con delivery estimator
- [ ] Stock movements registrados
- [ ] Frontend con gestión de estados
- [ ] Tests E2E completos
- [ ] CI passing
