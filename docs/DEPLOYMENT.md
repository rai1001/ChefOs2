# Deployment Guide

## Overview
- **Frontend**: Hosted on [Vercel](https://vercel.com).
- **Backend/Database**: Hosted on [Supabase](https://supabase.com).
- **CI/CD**: GitHub Actions for automated testing and deployment.

## 1. Prerequisites
- Node.js 18+
- Supabase CLI installed and authenticated.
- Vercel CLI installed (optional, for local emulation).

## 2. Environment Variables
Ensure the following variables are set in your CI/CD provider and local `.env` files:

### Frontend (.env)
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (Supabase Secrets)
```bash
SUPABASE_ACCESS_TOKEN=your_access_token
SUPABASE_DB_PASSWORD=your_db_password
```

## 3. Deployment Steps

### Frontend (Vercel)
The frontend is automatically deployed via GitHub integration or Vercel CLI.
```bash
cd frontend
vercel --prod
```

### Backend (Supabase)
Deploy database migrations and Edge Functions:
```bash
supabase link --project-ref your-project-id
supabase db push
supabase functions deploy
```

## 4. CI/CD Pipeline
The project uses GitHub Actions defined in `.github/workflows/`:
- **CI (`ci.yml`)**: Runs unit tests and linting on every Pull Request.
- **Deploy (`deploy.yml`)**: Deploys to production on push to `main` branch.
