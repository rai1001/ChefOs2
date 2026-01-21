# Business Rules

## 1. Inventory & Purchasing

### Safety Buffer Logic
- **Definition**: A percentage surplus added to calculated demand to account for waste and spoilage.
- **Rule**: Safety buffer is defined at the **Product Family** level.
- **Defaults**:
    - Vegetables/Fresh: 15% (1.15)
    - Meat/Fish: 5% (1.05)
    - Dry Goods: 2% (1.02)
- **Fallback**: If no family is assigned, default is 10%.

### Lead Time & Cut-off
- **Lead Time**: Defined in days per supplier.
- **Cut-off Time**: The specific time (e.g., 11:00 AM) by which an order must be placed to count for the current day.
- **Calculation**:
    - If `Order Time > Cut-off Time`: Start counting from T+1.
    - Weekends and non-delivery days are skipped in the calculation.

### Unit Conversions
- **Global**: Standard conversions (kg -> g, l -> ml) apply to all ingredients.
- **Specific**: Ingredient-specific conversions (e.g., "1 Bunch of Parsley" -> "50g") take precedence over global rules.

---

## 2. Event & Production

### Event Types
- **Banquet**: Exact headcount required. High precision.
- **A La Carte**: Demand is forecasted based on historical data.
- **Sports Multi**: Uses "Direct Ingredients" (container) instead of specific recipes.

### Production Planning
- **Task Generation**: Automatically generated from confirmed Event Menus.
- **Status Flow**: `Pending` -> `Paused` (Missing Stock) -> `Ready` -> `In Progress` -> `Completed`.

---

## 3. Security & Access

### Multi-tenancy
- **Strict Isolation**: All queries must be scoped to `organization_id`.
- **Row Level Security (RLS)**: Enforced at the database level.

### Roles (RBAC)
- **ORG_ADMIN**: Full access to all resources.
- **AREA_MANAGER**: Management of specific areas (Purchasing, Kitchen).
- **COOK**: View-only for recipes/events, update access for production status.
- **VIEWER**: Strict read-only access.
