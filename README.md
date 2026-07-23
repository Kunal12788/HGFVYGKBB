# Customer Frontend

## Security Notice — Supabase Key Rotation Required

> [!IMPORTANT]
> **CRITICAL SECURITY ACTION REQUIRED:**
> The `VITE_SUPABASE_ANON_KEY` previously configured in `.env` was identified as a Supabase `service_role` key.
> Because `service_role` keys bypass all Row Level Security (RLS) policies, this key must be **immediately rotated**:
> 1. Go to the Supabase Dashboard → **Project Settings** → **API**.
> 2. Revoke / Rotate the `service_role` secret key.
> 3. Copy the public `anon` key (or `sb_publishable_...` key) whose JWT payload role is `anon`.
> 4. Create your local `.env` file (copied from `.env.example`) and place the new `anon` key in `VITE_SUPABASE_ANON_KEY`.
> 
> **NEVER** commit `.env` or any `service_role` key to source control.
