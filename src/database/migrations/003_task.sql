CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    record_id UUID NOT NULL
        REFERENCES records(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    description TEXT,

    completed BOOLEAN NOT NULL DEFAULT FALSE,

    due_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    record_id UUID NOT NULL
        REFERENCES records(id)
        ON DELETE CASCADE,

    remind_at TIMESTAMPTZ NOT NULL,

    message TEXT,

    completed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);