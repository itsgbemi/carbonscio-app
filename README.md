# Carbonscio - Climate Literacy App

Become climate literate through a cheeky, neo-brutalist game experience. Track offsets, roast companies, and quiz your way to a greener planet.

## Deployment to Vercel

This project is optimized for deployment on Vercel.

### 1. Environment Variables

You must configure the following environment variables in your Vercel project settings:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous API key |
| `GEMINI_API_KEY` | Required for Gemini AI features (if used) |

### 2. Supabase Setup

Before deploying, ensure you have run the `supabase_setup.sql` script in your Supabase SQL Editor to create the necessary tables and seed data.

### 3. Build Settings

Vercel should automatically detect the settings, but if not:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Development

```bash
npm install
npm run dev
```
