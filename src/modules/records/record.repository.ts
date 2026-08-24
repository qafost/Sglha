import { db } from "../../database/client.js";

export interface Record {
  id: string;
  user_id: string;
  conversation_id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface RecordTask {
  id: string;
  record_id: string;
  title: string;
  description: string | null;
  due_at: Date | null;
  completed: boolean;
  created_at: Date;
}

export interface RecordReminder {
  id: string;
  record_id: string;
  remind_at: Date;
  message: string | null;
  completed: boolean;
  created_at: Date;
}

export interface RecordWithDetails extends Record {
  tasks: RecordTask[];
  reminder: RecordReminder | null;
}


// ==================================================
// Create
// ==================================================

export async function createRecord(
  input: {
    userId: string;
    conversationId: string;
    title: string;
    description: string;
  }
): Promise<Record> {

  const result = await db.query<Record>(
    `
    INSERT INTO records (
      user_id,
      conversation_id,
      title,
      description
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      input.userId,
      input.conversationId,
      input.title,
      input.description,
    ]
  );

  return result.rows[0];
}


// ==================================================
// User Records
// ==================================================

export async function findRecordsByUserId(
  userId: string
): Promise<Record[]> {

  const result = await db.query<Record>(
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
// Records With Tasks + Reminders
// ==================================================

export async function findRecordsWithDetailsByUserId(
  userId: string
): Promise<RecordWithDetails[]> {

  const records =
    await db.query<Record>(
      `
      SELECT *
      FROM records
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

  const result: RecordWithDetails[] = [];

  for (const record of records.rows) {

    const tasks =
      await db.query<RecordTask>(
        `
        SELECT
          id,
          record_id,
          title,
          description,
          due_at,
          completed,
          created_at
        FROM tasks
        WHERE record_id = $1
        ORDER BY created_at ASC
        `,
        [record.id]
      );

    const reminders =
      await db.query<RecordReminder>(
        `
        SELECT
          id,
          record_id,
          remind_at,
          message,
          completed,
          created_at
        FROM reminders
        WHERE record_id = $1
        ORDER BY remind_at ASC
        LIMIT 1
        `,
        [record.id]
      );

    result.push({
      ...record,

      tasks: tasks.rows,

      reminder:
        reminders.rows[0] ?? null,
    });
  }

  return result;
}


// ==================================================
// Find One
// ==================================================

export async function findRecordById(
  recordId: string
): Promise<Record | null> {

  const result = await db.query<Record>(
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


// ==================================================
// Find One Owned By User
// ==================================================

export async function findRecordByIdAndUser(
  recordId: string,
  userId: string
): Promise<Record | null> {

  const result = await db.query<Record>(
    `
    SELECT *
    FROM records
    WHERE
      id = $1
      AND user_id = $2
    LIMIT 1
    `,
    [
      recordId,
      userId,
    ]
  );

  return result.rows[0] ?? null;
}


// ==================================================
// Delete One
// ==================================================

export async function deleteRecord(
  recordId: string,
  userId: string
): Promise<boolean> {

  const result = await db.query(
    `
    DELETE FROM records
    WHERE
      id = $1
      AND user_id = $2
    `,
    [
      recordId,
      userId,
    ]
  );

  return result.rowCount === 1;
}


// ==================================================
// Delete All
// ==================================================

export async function deleteAllUserRecords(
  userId: string
): Promise<number> {

  const result = await db.query(
    `
    DELETE FROM records
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rowCount ?? 0;
}
