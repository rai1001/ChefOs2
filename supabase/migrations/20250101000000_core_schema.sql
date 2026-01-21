-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums
CREATE TYPE organization_role AS ENUM ('ORG_ADMIN', 'AREA_MANAGER', 'COOK', 'SERVER');
CREATE TYPE subscription_plan AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- 2. Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NULL UNIQUE,
  plan subscription_plan DEFAULT 'FREE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- 3. Users (Profile table linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Organization Members
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role organization_role NOT NULL DEFAULT 'COOK',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- 5. Helper Functions for RLS (Moved to PUBLIC schema)
CREATE OR REPLACE FUNCTION public.get_user_organization_ids()
RETURNS SETOF UUID AS $$
  SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 6. RLS Policies

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view self" ON users;
CREATE POLICY "Users can view self"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view their organizations" ON organizations;
CREATE POLICY "Members can view their organizations"
  ON organizations FOR SELECT
  USING (id IN (SELECT public.get_user_organization_ids()));

-- Organization Members
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view members of their organizations" ON organization_members;
CREATE POLICY "Members can view members of their organizations"
  ON organization_members FOR SELECT
  USING (organization_id IN (SELECT public.get_user_organization_ids()));
