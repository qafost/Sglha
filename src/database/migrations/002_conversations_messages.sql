CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX conversations_user_id_idx ON conversations(user_id);

CREATE TABLE users (
    id UUID PRIMARY KEY
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    whatsapp_message_id TEXT UNIQUE,

    direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),

    message_type TEXT NOT NULL DEFAULT 'text',

    contect TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);


CREATE INDEX messages_user_id_idx ON messages(user_id);


CREATE INDEX messages_created_at_idx ON messages(created_at);