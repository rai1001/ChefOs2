# SPRINT 10: Planificación de Producción con Gantt 📅

**Objetivo:** Implementar timeline visual de producción con dependencias entre tareas.

---

## 🎯 ARQUITECTURA

### Migración: Production Planning
- `production_tasks`: Tareas de cocina con fecha inicio/fin, asignado a, y estado.
- `task_dependencies`: Relaciones entre tareas (Finish-to-Start, etc.).
- `generate_production_tasks_from_event`: Función automática para crear tareas base desde recetas del menú.

### Frontend - Gantt Component (`ProductionGantt.tsx`)
- Librería: `gantt-task-react`.
- Vistas: Hora, Cuarto de día, Día.
- Colores por estado (Pending, In Progress, Completed).
- Visualización de progreso.

### Backend - Automation
- Generación automática de tareas basada en recetas (por ahora duración hardcoded 30min).
- Asignación de partidas (`station`).

---

## ✅ DEFINITION OF DONE

- [ ] Tablas de tareas y dependencias creadas
- [ ] Generación automática de tareas desde eventos
- [ ] Endpoint CRUD de tareas
- [ ] Componente Gantt interactivo
- [ ] Drag & Drop para reprogramar tareas (update fechas)
- [ ] Asignación de cocineros a tareas
