CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    record_id UUID NOT NULL     
        REFERENCES records(id)
        ON DELETE CASCADE,

    remind_at TIMESTAMPTZ NOT NULL,

    message TEXT,

    sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);