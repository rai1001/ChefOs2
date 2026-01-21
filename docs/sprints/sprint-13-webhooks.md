# SPRINT 13: API Webhooks para Integraciones 🔗

**Duración:** 1 semana
**Objetivo:** Implementar sistema de webhooks para notificar eventos a aplicaciones externas en tiempo real.

---

## 🎯 ARQUITECTURA

### Migración: Webhooks System
- `webhook_endpoints`: Configuración de URLs y eventos suscritos por organización.
- `webhook_deliveries`: Log de intentos de entrega, status, payloads y respuestas.
- Enums: `webhook_event` (ingredient.low_stock, po.created, etc.), `delivery_status`.
- Triggers: `trigger_webhook_low_stock`, `trigger_webhook_po_created`, `trigger_webhook_po_status`. Autosave en tabla `webhook_deliveries` como `PENDING`.

### Backend - Dispatcher (`WebhookDispatcherService`)
- Cron Job (`webhook-worker.ts`) ejecutado cada minuto.
- Procesa entregas `PENDING` o `RETRYING`.
- Firma payloads con HMAC-SHA256 (`X-Webhook-Signature`).
- Backoff exponencial para reintentos.
- Logs detallados de éxito/error.

### Backend - Controller (`WebhooksController`)
- CRUD de Webhooks.
- `sendTest`: Endpoint para probar un webhook manualmente.
- `getDeliveries`: Historial de entregas.

### Frontend - Webhooks Management (`Webhooks.tsx`)
- Lista de webhooks activos.
- Formulario de creación/edición (URL, Secret, Eventos).
- Botón para enviar test.
- Visualización de logs de entregas.

---

## ✅ DEFINITION OF DONE

- [ ] Tablas de webhooks y deliveries creadas
- [ ] Triggers de base de datos para eventos clave
- [ ] Service dispatcher con firma y reintentos
- [ ] Worker configurado en `index.ts`
- [ ] UI de gestión de webhooks
- [ ] Documentación de API para integradores
