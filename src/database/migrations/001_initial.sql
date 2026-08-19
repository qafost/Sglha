CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    whatsapp_id TEXT NOT NULL UNIQUE,

    phone_number TEXT NOT NULL,

    name TEXT, 

    timezone TEXT NOT NULL DEFAULT 'Africa/Cairo',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);