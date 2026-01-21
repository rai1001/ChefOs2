# CulinaryOS MVP - Database Schema

This document defines the complete database schema for CulinaryOS MVP, including tables, relationships, RLS policies, and business logic functions.

## Overview
- **Database**: PostgreSQL (Supabase)
- **Extensions**: `uuid-ossp`, `pgcrypto`
- **Architecture**: Multi-tenant (Organization-based)

---

## 1. Enums & Types

### Organization Roles
```sql
CREATE TYPE organization_role AS ENUM (
  'ORG_ADMIN',      -- Full access
  'AREA_MANAGER',   -- Area management
  'COOK',           -- Kitchen access only
  'SERVER'          -- Service access only
);
```

### Event Types
```sql
CREATE TYPE event_type AS ENUM (
  'BANQUET',        -- Closed event (exact headcount)
  'A_LA_CARTE',     -- Daily menu (estimation)
  'COFFEE',         -- Coffee break
  'BUFFET',         -- Buffet
  'COCKTAIL',       -- Cocktail
  'COMPANY_MENU',   -- Company menu
  'TOURIST_MENU',   -- Tourist menu
  'SPORTS_MULTI'    -- Sports services container
);
```

### Event Status
```sql
CREATE TYPE event_status AS ENUM (
  'DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);
```

### Purchase Order Status
```sql
CREATE TYPE purchase_order_status AS ENUM (
  'DRAFT', 'SENT', 'RECEIVED', 'PARTIAL', 'CANCELLED'
);
```

### Unit Types
```sql
CREATE TYPE unit_type AS ENUM (
  'MASS', 'VOLUME', 'UNIT', 'LENGTH'
);
```

### Production Status
```sql
CREATE TYPE production_status AS ENUM (
  'PENDING', 'PAUSED', 'READY', 'IN_PROGRESS', 'COMPLETED'
);
```

### Subscription Plans
```sql
CREATE TYPE subscription_plan AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
```

---

## 2. Core Tables

### Organizations (Multi-tenant)
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  plan subscription_plan DEFAULT 'FREE',
  max_users INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);
```

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

### Organization Members (Join Table)
```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role organization_role NOT NULL DEFAULT 'COOK',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);
```

---

## 3. Operations Tables

### Product Families
```sql
CREATE TABLE product_families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  safety_buffer_pct DECIMAL(5,2) DEFAULT 1.10 CHECK (safety_buffer_pct >= 1.00 AND safety_buffer_pct <= 2.00),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);
```

### Units
```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  abbreviation VARCHAR(10) NOT NULL UNIQUE,
  type unit_type NOT NULL
);
```

### UOM Conversions
```sql
CREATE TABLE uom_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  to_unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  factor DECIMAL(12,4) NOT NULL CHECK (factor > 0),
  ingredient_id UUID NULL, -- NULL = global conversion
  UNIQUE(from_unit_id, to_unit_id, ingredient_id)
);
```

### Suppliers
```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NULL,
  contact_phone VARCHAR(50) NULL,
  lead_time_days INTEGER DEFAULT 2 CHECK (lead_time_days >= 0),
  cut_off_time TIME NULL,
  delivery_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  UNIQUE(organization_id, name)
);
```

### Ingredients
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  family_id UUID NULL REFERENCES product_families(id) ON DELETE SET NULL,
  supplier_id UUID NULL REFERENCES suppliers(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0.00,
  unit_id UUID NOT NULL REFERENCES units(id),
  stock_current DECIMAL(12,3) DEFAULT 0.00,
  stock_min DECIMAL(12,3) DEFAULT 0.00,
  barcode VARCHAR(100) NULL UNIQUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  UNIQUE(organization_id, name, supplier_id)
);
```

### Recipes
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  servings INTEGER DEFAULT 1 CHECK (servings > 0),
  total_cost DECIMAL(10,2) DEFAULT 0.00,
  cost_per_serving DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  UNIQUE(organization_id, name)
);
```

### Recipe Ingredients
```sql
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(12,3) NOT NULL CHECK (quantity > 0),
  unit_id UUID NOT NULL REFERENCES units(id),
  UNIQUE(recipe_id, ingredient_id)
);
```

### Events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  event_type event_type NOT NULL,
  status event_status DEFAULT 'DRAFT',
  date_start TIMESTAMPTZ NOT NULL,
  date_end TIMESTAMPTZ NULL,
  pax INTEGER DEFAULT 0 CHECK (pax >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
```

### Event Menus
```sql
CREATE TABLE event_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  recipe_id UUID NULL REFERENCES recipes(id) ON DELETE CASCADE,
  qty_forecast INTEGER DEFAULT 0 CHECK (qty_forecast >= 0),
  UNIQUE(event_id, recipe_id)
);
```

### Purchase Orders
```sql
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  event_id UUID NULL REFERENCES events(id) ON DELETE SET NULL,
  status purchase_order_status DEFAULT 'DRAFT',
  order_date TIMESTAMPTZ DEFAULT NOW(),
  delivery_date_estimated TIMESTAMPTZ NULL,
  delivery_date_actual TIMESTAMPTZ NULL,
  total_cost DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
```

### Purchase Order Items
```sql
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_ordered DECIMAL(12,3) NOT NULL,
  quantity_received DECIMAL(12,3) DEFAULT 0.00,
  unit_id UUID NOT NULL REFERENCES units(id),
  unit_price DECIMAL(10,2) DEFAULT 0.00,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity_ordered * unit_price) STORED,
  UNIQUE(purchase_order_id, ingredient_id)
);
```

---

## 4. Row Level Security (RLS)

All tables have RLS enabled. Policies are based on `organization_id` isolation.

### Helper Function
```sql
CREATE FUNCTION auth.user_organization_ids()
RETURNS SETOF UUID AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE;
```

### Standard Policy Pattern
Most tables (`ingredients`, `recipes`, `suppliers`, etc.) follow this pattern:

**SELECT Policy:**
```sql
USING (organization_id IN (SELECT auth.user_organization_ids()))
```

**ALL/MANAGE Policy (Admins/Managers):**
```sql
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('ORG_ADMIN', 'AREA_MANAGER')
  )
)
```

**Global Tables:**
`units` and `uom_conversions` are readable by authenticated users via `USING (true)`.

---

## 5. Business Functions

### Calculate Safety Buffer
```sql
FUNCTION get_safety_buffer(p_family_id UUID) RETURNS DECIMAL
```
Returns the safety buffer percentage for a product family (default 1.10 or 10%).

### Calculate Delivery Date
```sql
FUNCTION calculate_delivery_date(p_supplier_id UUID, p_order_datetime TIMESTAMPTZ) RETURNS TIMESTAMPTZ
```
Calculates estimated delivery based on:
1. `cut_off_time`: If order is after cut-off, adds 1 day.
2. `lead_time_days`: Adds lead time (skipping weekends).
3. `delivery_days`: Advances to the next valid delivery day for the supplier.
