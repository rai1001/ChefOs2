# SPRINT 06: CSV Import & Kitchen Mode 📱

**Duración:** 1 semana (5 días hábiles)
**Objetivo:** Implementar importación masiva de ingredientes con wizard de resolución de conflictos + Portal de cocina con escáner QR.

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Importador CSV con wizard de conflictos
- ✅ Upsert logic implementada
- ✅ Portal Kitchen Mode responsive
- ✅ Escáner QR funcional
- ✅ Modo ráfaga implementado
- ✅ Tests completos

---

## 🎯 TAREAS DETALLADAS

### **DÍA 1: Backend - CSV Parser**

#### Tarea 1.1: Service de importación (`CSVImporterService`)
- FASE 1: `analyzeCSV(buffer)` - Detectar proveedores desconocidos.
- FASE 2: `executeImport(buffer, resolutions)` - Crear/Vincular proveedores y Upsert ingredientes.
- Helpers: `resolveSupplier`, `resolveUnit`, `resolveFamily`.

#### Tarea 1.2: Endpoints
- `POST /ingredients/import/analyze`: Recibe CSV, retorna análisis.
- `POST /ingredients/import/execute`: Recibe CSV + array de resoluciones.
- Multer configura para aceptar solo CSVs.

---

### **DÍA 2-3: Frontend - Wizard de Importación**

#### Tarea 2.1: Wizard Component (`CSVImportWizard`)
- **Paso 1: Upload.** Selección de archivo.
- **Paso 2: Resolve.** Lista de proveedores desconocidos con opciones:
    - "Crear Nuevo" (Acción por defecto).
    - "Vincular a existente" (Select con proveedores de la BD).
- **Paso 3: Importing.** Barra de progreso y resumen de resultados (creados, actualizados, errores).
- **Paso 4: Complete.** Resumen final.

---

### **DÍA 4-5: Kitchen Mode + QR Scanner**

#### Tarea 4.1: Página Kitchen Mode (`Kitchen.tsx`)
- Diseño "Mobile First" con tarjetones grandes.
- Acciones rápidas: Escáner, Salida Manual, Registrar Merma.

#### Tarea 4.2: QR Scanner (`QuickScanner.tsx`)
- Librería: `html5-qrcode`.
- **Modo Normal:** Escanear -> Confirmar -> API.
- **Modo Ráfaga:** Escanear -> API directa (beep) -> Seguir escaneando.

#### Tarea 4.3: Stock Out Form
- Modal para salida manual de stock sin QR.

---

## ✅ DEFINITION OF DONE

- [ ] CSV Importer con wizard implementado (≥90% coverage)
- [ ] Upsert logic funcional
- [ ] Wizard de resolución de conflictos
- [ ] Kitchen Mode responsive
- [ ] QR Scanner funcional con html5-qrcode
- [ ] Modo ráfaga implementado
- [ ] Sonido de beep
- [ ] Tests E2E completos
- [ ] CI passing
- [ ] Documentación actualizada
