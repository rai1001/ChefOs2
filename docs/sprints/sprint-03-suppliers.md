# SPRINT 03: Proveedores & Lead Time 🚚

**Duración:** 1 semana (5 días hábiles)
**Objetivo:** Implementar gestión completa de proveedores con algoritmo de estimación de fecha de entrega (Lead Time + Cut-off Time + Delivery Days).

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Cobertura de tests ≥ 90%
- ✅ CRUD de proveedores funcional
- ✅ Algoritmo de delivery date con tests exhaustivos
- ✅ Widget de countdown implementado
- ✅ Validación de días de reparto

---

## 🎯 TAREAS DETALLADAS

### **DÍA 1: Backend - CRUD de Proveedores**

#### Tarea 1.1: Controller de proveedores
- Endpoints CRUD estándar.
- Validación de `delivery_days` (array de 1-7).
- Validación de `cut_off_time` (HH:MM:SS).

#### Tarea 1.2: Validadores Zod
- Schema para creación/edición de proveedores.

---

### **DÍA 2: Algoritmo de Estimación de Entrega**

#### Tarea 2.1: Service de cálculo (`DeliveryEstimatorService`)
- Método `estimateDeliveryDate(supplierId, orderDate)`.
- Considerar:
    - Lead Time (días hábiles).
    - Cut-off Time (si pasó, sumar +1 día).
    - Días de reparto permitidos.

#### Tarea 2.2: Endpoint de estimación
- `GET /suppliers/:id/estimate-delivery?order_date=...`

---

### **DÍA 3: Tests del Algoritmo**

#### Tarea 3.1: Unit Tests
- Testear edge cases: fin de semana, misma hora de cut-off, días de reparto salteados.
- Mockear base de datos.
- Cobertura 100% en el service.

---

### **DÍA 4: Frontend - UI de Proveedores**

#### Tarea 4.1: Service Frontend
- `suppliers.service.ts`

#### Tarea 4.2: Formulario de Proveedor
- UI para seleccionar días de semana (L, M, X, J, V, S, D).
- Inputs para Lead Time y Cut-off.

---

### **DÍA 5: Widget de Countdown**

#### Tarea 5.1: Componente Dashboard
- Componente `SupplierCountdown`.
- Mostrar tiempo restante para proveedores "urgentes" (cerca del cut-off).
- Alerta visual si se pasó la hora.

---

## ✅ DEFINITION OF DONE

- [ ] CRUD de proveedores completo y testeado (≥90%)
- [ ] Algoritmo de delivery date con tests exhaustivos
- [ ] Validación de días de reparto
- [ ] Endpoint de estimación funcional
- [ ] Widget de countdown implementado y actualizado en tiempo real
- [ ] Tests E2E de flujo completo
- [ ] CI passing
- [ ] Documentación actualizada
