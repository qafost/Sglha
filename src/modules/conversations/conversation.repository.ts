import { db } from "../../database/client.js";

export interface Conversation {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export async function createConversation(
  userid: string
): Promise<Conversation> {
  const result = await db.query<Conversation>(
    `
      INSERT INTO conversations (user_id)
      VALUES ($1)
      RETURNING *
    `,
    [userid]
  );

  return result.rows[0];
}

export async function findLatestConversation(
  userid: string
): Promise<Conversation | null> {
  const result = await db.query<Conversation>(
    `
      SELECT *
      FROM conversations
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `,
    [userid]
  );

  return result.rows[0] ?? null;
}