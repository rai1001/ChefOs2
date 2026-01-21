# SPRINT 12: Gestión de Mermas y Causas 📉

**Objetivo:** Implementar sistema completo de registro de mermas con categorización por causas y análisis.

---

## 🎯 ARQUITECTURA

### Migración: Waste Tracking
- `waste_causes`: Catálogo configurable (Caducidad, Quemado, etc.) con flag `preventable`.
- `stock_movements`: Nuevas columnas `waste_cause_id`, `waste_cost`.
- `v_waste_analysis`: Vista SQL para facilitar reportes.
- RPCs: `calculate_waste_by_period`, `get_top_wasted_ingredients`.

### Backend - Waste Service (`WasteManagementService`)
- `recordWaste`:
    1. Obtiene coste del ingrediente.
    2. Verifica si la causa es prevenible.
    3. Registra movimiento (`WASTE`).
    4. Decrementa stock.
- `getWasteAnalysis`: Agrupación por causa.
- `getPreventableWastePercentage`: KPI clave.

### Frontend - Waste Recording (`RecordWasteForm.tsx`)
- Formulario con cálculo de coste estimado en tiempo real.
- Select de causas con indicador visual (🟡) para prevenibles.
- Validación con Zod.

---

## ✅ DEFINITION OF DONE

- [ ] Tabla `waste_causes` con seed data
- [ ] Lógica de registro de mermas con coste
- [ ] Vistas y funciones de análisis
- [ ] Pantalla de registro de mermas (Mobile First)
- [ ] Gráficos de análisis de mermas en Dashboard
