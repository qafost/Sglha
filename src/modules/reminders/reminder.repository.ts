import { db } from "../../database/client.js";

export interface Reminder {
  id: string;
  record_id: string;
  remind_at: Date;
  message: string | null;
  created_at: Date;
}

export async function createReminder(input: {
  recordId: string;
  remindAt: string;
  message?: string;
}): Promise<Reminder> {
  const result = await db.query<Reminder>(
    `
      INSERT INTO reminders (
        record_id,
        remind_at,
        message
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [
      input.recordId,
      input.remindAt,
      input.message ?? null,
    ]
  );

  return result.rows[0];
}

export async function findReminderByRecordId(
  recordId: string
): Promise<Reminder | null> {
  const result = await db.query<Reminder>(
    `
      SELECT *
      FROM reminders
      WHERE record_id = $1
      ORDER BY remind_at ASC
      LIMIT 1
    `,
    [recordId]
  );

  return result.rows[0] ?? null;
}
export interface DueReminder extends Reminder {
  phone_number: string;
}


// ==================================================
// Find Due Reminders With User Phone
// ==================================================

export interface DueReminder extends Reminder {

  phone_number: string;

  title: string;

  user_id: string;

  conversation_id: string;
}


export async function findDueRemindersWithUser(): Promise<
  DueReminder[]
> {

  const result =
    await db.query<DueReminder>(
      `
      SELECT

        r.id,

        r.record_id,

        r.remind_at,

        r.message,

        r.completed,

        r.created_at,

        u.phone_number,

        rec.title,

        rec.user_id,

        rec.conversation_id

      FROM reminders r

      INNER JOIN records rec
        ON rec.id = r.record_id

      INNER JOIN users u
        ON u.id = rec.user_id

      WHERE
        r.completed = false

        AND

        r.remind_at <= NOW()

      ORDER BY
        r.remind_at ASC
      `
    );

  return result.rows;
}



export async function markReminderAsCompleted(
  reminderId: string
): Promise<void> {

  await db.query(
    `
    UPDATE reminders

    SET completed = true

    WHERE id = $1
    `,
    [reminderId]
  );
}
