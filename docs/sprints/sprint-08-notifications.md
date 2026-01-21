# SPRINT 08: Sistema de Notificaciones Push 🔔

**Objetivo:** Implementar sistema de notificaciones en tiempo real para alertas de stock, órdenes pendientes, etc.

---

## 🎯 FEATURES

### Backend - Nuevas Tablas

#### Migración: Notifications Table
- `notifications`: Almacena alertas con prioridad, tipo (LOW_STOCK, ORDER_RECEIVED, etc.) y estado de lectura.
- Trigger `notify_low_stock`: Crea automáticamente notificaciones cuando el stock baja del mínimo.

### Backend - Notification Service (`NotificationService`)
- `create`: Crea notificación (para uso manual o desde otros servicios).
- `markAsRead`: Marca una notificación como leída.
- `markAllAsRead`: Limpiar bandeja.
- `cleanExpired`: Job para borrar notificaciones viejas.

### Frontend - Notification Bell (`NotificationBell.tsx`)
- Componente de campana con badge de "no leídos".
- Polling cada 30 segundos (o WebSocket si se implementa más adelante).
- Lista desplegable con las últimas notificaciones.
- Formato de fecha relativo ("hace 5 minutos").

---

## ✅ DEFINITION OF DONE

- [ ] Tabla de notificaciones creada
- [ ] Trigger de bajo stock funcional
- [ ] Endpoint de notificaciones (GET, PATCH)
- [ ] Componente NotificationBell integrado en el Header
- [ ] Tests de integración para el trigger
- [ ] Estilizado de la lista de notificaciones (leído vs no leído)
