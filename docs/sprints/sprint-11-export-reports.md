# SPRINT 11: Exportación de Reportes (PDF/Excel) 📄

**Duración:** 1 semana
**Objetivo:** Implementar generación de reportes descargables en PDF y Excel con templates profesionales.

---

## 🎯 ARQUITECTURA

### Backend - Report Generator Service (`ReportGeneratorService`)
- Librerías: `pdfkit` (PDF), `exceljs` (Excel).
- **Food Cost PDF**:
    - Header con logo y fechas.
    - Resumen de KPIs (Coste total, Food Cost %).
    - Tabla mensual detallada.
- **Inventory Excel**:
    - Listado de ingredientes con stock actual, mínimo y valoración.
    - Formato condicional (Rojo para bajo stock).
- **Purchase Orders Excel**:
    - Sheet 1: Resumen de órdenes.
    - Sheet 2: Detalle por ítems.

### Backend - Controller (`ReportsController`)
- Endpoints streaming (`res.send(buffer)`) con headers correctos (`Content-Type`, `Content-Disposition`).
- `exportFoodCostPDF`
- `exportInventoryExcel`
- `exportPurchaseOrdersExcel`

### Frontend - Export Buttons (`ExportButtons.tsx`)
- Dropdown para elegir formato.
- Manejo de descarga via `Blob` y `window.URL.createObjectURL`.

---

## ✅ DEFINITION OF DONE

- [ ] Servicio de generación de PDF implementado
- [ ] Servicio de generación de Excel implementado
- [ ] Styles y templates aprobados
- [ ] Endpoints de descarga funcionando
- [ ] Botones de exportación en Dashboard e Inventario
- [ ] Tests unitarios para el generador de reportes
