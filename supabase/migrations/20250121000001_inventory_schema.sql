-- 1. Unit Types & Tables
CREATE TYPE unit_type AS ENUM ('MASS', 'VOLUME', 'UNIT', 'LENGTH');

CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  abbreviation VARCHAR(10) NOT NULL UNIQUE,
  type unit_type NOT NULL
);

-- Seed Units (Global)
INSERT INTO units (name, abbreviation, type) VALUES
('Kilogram', 'kg', 'MASS'),
('Gram', 'g', 'MASS'),
('Milligram', 'mg', 'MASS'),
('Pound', 'lb', 'MASS'),
('Ounce', 'oz', 'MASS'),
('Liter', 'l', 'VOLUME'),
('Milliliter', 'ml', 'VOLUME'),
('Gallon', 'gal', 'VOLUME'),
('Fluid Ounce', 'fl oz', 'VOLUME'),
('Unit', 'u', 'UNIT'),
('Bunch', 'bunch', 'UNIT')
ON CONFLICT (name) DO NOTHING;

-- RLS for Units (Public Read)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for units" ON units FOR SELECT USING (true);


-- 2. Product Families
CREATE TABLE IF NOT EXISTS product_families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  safety_buffer_pct DECIMAL(5,2) DEFAULT 1.10 CHECK (safety_buffer_pct >= 1.00 AND safety_buffer_pct <= 2.00),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

ALTER TABLE product_families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view families" ON product_families
FOR SELECT USING (organization_id IN (SELECT public.get_user_organization_ids()));

CREATE POLICY "Admins/Managers can manage families" ON product_families
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('ORG_ADMIN', 'AREA_MANAGER')
  )
);


-- 3. Suppliers (Prerequisite for Ingredients)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NULL,
  contact_phone VARCHAR(50) NULL,
  lead_time_days INTEGER DEFAULT 2 CHECK (lead_time_days >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  UNIQUE(organization_id, name)
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view suppliers" ON suppliers
FOR SELECT USING (organization_id IN (SELECT public.get_user_organization_ids()));

CREATE POLICY "Admins/Managers can manage suppliers" ON suppliers
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('ORG_ADMIN', 'AREA_MANAGER')
  )
);


-- 4. Ingredients
CREATE TABLE IF NOT EXISTS ingredients (
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

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view ingredients" ON ingredients
FOR SELECT USING (organization_id IN (SELECT public.get_user_organization_ids()));

CREATE POLICY "Admins/Managers can manage ingredients" ON ingredients
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('ORG_ADMIN', 'AREA_MANAGER')
  )
);


-- 5. UOM Conversions
CREATE TABLE IF NOT EXISTS uom_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  to_unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  factor DECIMAL(12,4) NOT NULL CHECK (factor > 0),
  ingredient_id UUID NULL REFERENCES ingredients(id) ON DELETE CASCADE, -- NULL = global conversion
  UNIQUE(from_unit_id, to_unit_id, ingredient_id)
);

ALTER TABLE uom_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for global conversions" ON uom_conversions FOR SELECT USING (ingredient_id IS NULL OR true);
-- Note: Simplified policy for conversions, allowing read all for now.
