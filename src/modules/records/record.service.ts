import {
  createRecord,
  findRecordsByUserId,
  deleteRecordsByUserId,
} from "./record.repository.js";

import {
  createTask,
} from "../tasks/task.repository.js";

import {
  createReminder,
} from "../reminders/reminder.repository.js";

// ==================================================
// Create Record
// ==================================================

export async function createUserRecord(input: {
  userId: string;

  title: string;

  description: string;

  tasks?: {
    title: string;

    description?: string;

    dueAt?: string | null;
  }[];

  reminder?: {
    remindAt: string;

    message?: string;
  } | null;
}) {

  // ----------------------------------------------
  // Create Record
  // ----------------------------------------------

  const record =
    await createRecord({
      userId: input.userId,

      title: input.title,

      description: input.description,
    });


  // ----------------------------------------------
  // Create Tasks
  // ----------------------------------------------

  const tasks = [];

  for (
    const task of input.tasks ?? []
  ) {

    const createdTask =
      await createTask({
        recordId: record.id,

        title: task.title,

        description:
          task.description,

        dueAt:
          task.dueAt,
      });

    tasks.push(
      createdTask
    );
  }


  // ----------------------------------------------
  // Create Reminder
  // ----------------------------------------------

  let reminder = null;

  if (
    input.reminder
  ) {

    reminder =
      await createReminder({
        recordId:
          record.id,

        remindAt:
          input.reminder.remindAt,

        message:
          input.reminder.message,
      });
  }


  // ----------------------------------------------
  // Return
  // ----------------------------------------------

  return {
    record,

    tasks,

    reminder,
  };
}


// ==================================================
// Get User Records
// ==================================================

export async function getUserRecords(
  userId: string
) {

  const records =
    await findRecordsByUserId(
      userId
    );


  const result = [];


  for (
    const record of records
  ) {

    const {
      findTasksByRecordId,
    } =
      await import(
        "../tasks/task.repository.js"
      );


    const {
      findReminderByRecordId,
    } =
      await import(
        "../reminders/reminder.repository.js"
      );


    const tasks =
      await findTasksByRecordId(
        record.id
      );


    const reminder =
      await findReminderByRecordId(
        record.id
      );


    result.push({
      record,

      tasks,

      reminder,
    });
  }


  return result;
}






// ==================================================
// Delete User Records
// ==================================================

export async function deleteUserRecords(
  userId: string
): Promise<number> {

  return deleteRecordsByUserId(
    userId
  );
}