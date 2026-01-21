# SPRINT 07: Analytics & Reporting Dashboard 📊

**Duración:** 1 semana
**Objetivo:** Implementar dashboard con KPIs, gráficos y reportes de Food Cost, mermas, proveedores y tendencias.

---

## 🎯 FEATURES

### Backend - Nuevas Tablas

#### Migración: Analytics Tables
- `analytics_kpis`: Tabla de KPIs precalculados (Daily, Weekly, Monthly).
- `analytics_ingredient_usage`: Top ingredientes por coste.
- `analytics_supplier_performance`: Métricas de proveedores (delivery time, discrepancies).
- `calculate_period_kpis`: RPC function para recálculo bajo demanda.

### Backend - Analytics Service (`AnalyticsService`)
- `getDashboardKPIs`: Retorna KPIs agregados para un periodo.
- `getTopIngredientsByCost`: Top N ingredientes.
- `getFoodCostTrend`: Tendencia de los últimos 6 meses.
- `getSupplierPerformance`: Ranking de proveedores.
- `getWasteByCause`: Análisis de motivos de merma.

### Backend - Controller (`AnalyticsController`)
- Endpoints para servir datos a los gráficos del frontend.

### Frontend - Dashboard (`Dashboard.tsx`)
- **KPI Cards:** Food Cost %, Mermas %, POs stats, Low Stock items.
- **Charts:**
    - `FoodCostChart` (LineChart): Evolución del coste.
    - `TopIngredientsChart` (BarChart): Pareto de gasto.
    - `WasteAnalysisChart` (PieChart): Causas de merma.
- **Widgets:** `SupplierCountdown` (Urgency).

---

## ✅ DEFINITION OF DONE

- [ ] Tablas de analítica creadas y migradas
- [ ] Jobs/Triggers para cálculo diario de KPIs
- [ ] Endpoints de analítica optimizados
- [ ] Dashboard implementado con Recharts
- [ ] Filtros de fecha en dashboard
- [ ] Exportación de datos básica (JSON/CSV)
- [ ] Tests de integración para cálculos de KPIs
