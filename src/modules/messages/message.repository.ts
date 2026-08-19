import { db } from "../../database/client.js";

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  whatsapp_message_id: string | null;
  direction: "incoming" | "outgoing";
  message_type: string;
  content: string | null;
  created_at: Date;
}

interface CreateMessageInput {
  conversationid: string;
  userid: string;
  whatsappMessageId?: string;
  direction: "incoming" | "outgoing";
  messageType?: string;
  content?: string;
}

export async function findMessageByWhatsAppId(
  whatsappMessageId: string
): Promise<Message | null> {
  const result = await db.query<Message>(
    `
      SELECT *
      FROM messages
      WHERE whatsapp_message_id = $1
      LIMIT 1
    `,
    [whatsappMessageId]
  );

  return result.rows[0] ?? null;
}

export async function createMessage(
  input: CreateMessageInput
): Promise<Message> {
  const result = await db.query<Message>(
    `
      INSERT INTO messages (
        conversation_id,
        user_id,
        whatsapp_message_id,
        direction,
        message_type,
        content
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      input.conversationid,
      input.userid,
      input.whatsappMessageId ?? null,
      input.direction,
      input.messageType ?? "text",
      input.content ?? null
    ]
  );

  return result.rows[0];
}