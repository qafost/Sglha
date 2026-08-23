import { db } from "../../database/client.js";

export interface Task {
  id: string;
  record_id: string;
  title: string;
  description: string | null;
  due_at: Date | null;
  created_at: Date;
}

export async function createTask(input: {
  recordId: string;
  title: string;
  description?: string;
  dueAt?: string | null;
}): Promise<Task> {
  const result = await db.query<Task>(
    `
      INSERT INTO tasks (
        record_id,
        title,
        description,
        due_at
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [
      input.recordId,
      input.title,
      input.description ?? null,
      input.dueAt ?? null,
    ]
  );

  return result.rows[0];
}

export async function findTasksByRecordId(
  recordId: string
): Promise<Task[]> {
  const result = await db.query<Task>(
    `
      SELECT *
      FROM tasks
      WHERE record_id = $1
      ORDER BY created_at ASC
    `,
    [recordId]
  );

  return result.rows;
}