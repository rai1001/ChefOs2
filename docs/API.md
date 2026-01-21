# API Documentation

## Overview
The CulinaryOS API consists of two main parts:
1.  **Supabase API**: Auto-generated REST/GraphQL endpoints from the database schema and RPC functions.
2.  **Node.js Backend**: Custom REST API for complex business logic, orchestrations, and integrations.

## 1. Supabase RPC Functions
These functions are callable via the Supabase Client (`supabase.rpc('function_name', params)`).

### Core Logic
- `get_safety_buffer(p_family_id)`: Returns safety buffer percentage for a product family.
- `calculate_delivery_date(p_supplier_id, p_order_datetime)`: Returns estimated delivery date based on lead time and cut-off.
- `check_permission(p_user_id, p_org_id, p_resource, p_action)`: Verifies granular permissions.

### Imports & Data
- `import_stage_csv(json_data)`: Stages raw CSV data.
- `import_commit(import_id)`: Commits staged data to main tables.

---

## 2. Backend REST Endpoints (Node.js)
Base URL: `/api/v1`

### Authentication (`/auth`)
- `POST /register`: Register new organization and admin.
- `POST /login`: Authenticate user.

### Suppliers (`/suppliers`)
- `GET /`: List suppliers.
- `POST /`: Create supplier.
- `GET /:id/estimate-delivery`: Service endpoint for delivery estimation.

### Ingredients (`/ingredients`)
- `GET /`: List ingredients.
- `POST /`: Create ingredient.
- `POST /import/analyze`: Analyze CSV file structure (AI/Heuristic).

### Ordering (`/orders`)
- `POST /calculate`: Generate optimal purchase order based on events and stock.
- `POST /:id/send`: Send PO via email to supplier.

### Webhooks (`/webhooks`)
- `POST /stripe`: Handle payment events.
- `POST /email-inbound`: Handle inbound supplier emails (OCR).
