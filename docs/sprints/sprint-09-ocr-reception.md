# SPRINT 09: OCR para Recepción de Albaranes 📸

**Duración:** 1 semana
**Objetivo:** Implementar escaneo automático de albaranes con OCR y cotejo contra órdenes de compra.

---

## 🎯 ARQUITECTURA

### Migración: Delivery Notes & Items
- `delivery_notes`: Almacena metadata del albarán, estado de OCR, y archivo.
- `delivery_note_items`: Líneas del albarán con cantidades y match con PO.
- `calculate_delivery_discrepancies`: Función DB para comparar albarán vs PO y detectar diferencias.

### Backend - OCR Service (`OCRService`)
- Integración con **Google Vision API**.
- `processDeliveryNote`:
    1. Detecta texto en imagen/PDF.
    2. Extrae número de albarán, fecha y tabla de items (regex parsing).
    3. Calcula confianza promedio.

### Backend - Reconciliation Service (`DeliveryReconciliationService`)
- `reconcileDeliveryNote`:
    1. Busca items del albarán y de la PO original.
    2. Realiza matching automático por nombre (Levenshtein similarity > 0.7).
    3. Calcula discrepancias (Missing items, Quantity mismatch, Extra items).
    4. Actualiza estado (`MATCHED`, `DISCREPANCY`, `MANUAL_REVIEW`).

### Frontend - Upload Component (`UploadDeliveryNote.tsx`)
- Drag & drop de archivo.
- Feedback de progreso ("Procesando OCR...").
- Muestra resultados:
    - Confianza del escaneo.
    - Items coincidentes.
    - Lista de discrepancias (si las hay).

---

## ✅ DEFINITION OF DONE

- [ ] Tablas `delivery_notes` y `items` creadas
- [ ] Servicio OCR conectado a Google Vision API
- [ ] Parser de albaranes robusto (reglas de texto)
- [ ] Algoritmo de reconciliación implementado
- [ ] UI de subida y revisión de resultados
- [ ] Manejo de errores de OCR
- [ ] Almacenamiento seguro de archivos en Storage
