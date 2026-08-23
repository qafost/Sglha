import { db } from "../../database/client.js";

export interface Record {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}


// ==================================================
// Create Record
// ==================================================

export async function createRecord(
  input: {
    userId: string;
    title: string;
    description: string;
  }
): Promise<Record> {

  const result =
    await db.query<Record>(
      `
      INSERT INTO records (
        user_id,
        title,
        description
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        input.userId,
        input.title,
        input.description,
      ]
    );

  return result.rows[0];
}


// ==================================================
// Find User Records
// ==================================================

export async function findRecordsByUserId(
  userId: string
): Promise<Record[]> {

  const result =
    await db.query<Record>(
      `
      SELECT *
      FROM records
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

  return result.rows;
}


// ==================================================
// Delete All User Records
// ==================================================

export async function deleteRecordsByUserId(
  userId: string
): Promise<number> {

  const result =
    await db.query(
      `
      DELETE FROM records
      WHERE user_id = $1
      `,
      [userId]
    );

  return result.rowCount ?? 0;
}


export async function findRecordById(
  recordId: string
): Promise<Record | null> {

  const result =
    await db.query<Record>(
      `
      SELECT *
      FROM records
      WHERE id = $1
      LIMIT 1
      `,
      [recordId]
    );

  return result.rows[0] ?? null;
}