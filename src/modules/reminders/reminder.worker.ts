
import {
  findDueRemindersWithUser,
  markReminderAsCompleted,
} from "./reminder.repository.js";

import {
  sendWhatsAppTextMessage,
} from "../whatsapp/whatsapp.client.js";

import {
  saveOutgoingMessage,
} from "../messages/message.service.js";


// ==================================================
// Process Due Reminders
// ==================================================

async function processDueReminders() {

  try {

    const reminders =
      await findDueRemindersWithUser();


    // ==========================================
    // No reminders
    // ==========================================

    if (reminders.length === 0) {
      return;
    }


    console.log(
      `FOUND ${reminders.length} DUE REMINDER(S)`
    );


    // ==========================================
    // Process reminders
    // ==========================================

    for (const reminder of reminders) {

      try {

        console.log(
          "PROCESSING REMINDER:",
          reminder.id
        );


        // ==========================================
        // Prepare message
        // ==========================================

        const reminderText =
          `⏰ تذكير من سجلها\n\n` +
          `${reminder.message ?? reminder.title}`;


        console.log(
          "REMINDER MESSAGE:",
          reminderText
        );


        // ==========================================
        // Send WhatsApp
        // ==========================================

        const whatsappResponse =
          await sendWhatsAppTextMessage({
            phoneNumber:
              reminder.phone_number,

            message:
              reminderText,
          });


        console.log(
          "REMINDER WHATSAPP RESPONSE:",
          JSON.stringify(
            whatsappResponse,
            null,
            2
          )
        );


        // ==========================================
        // Get WhatsApp message ID
        // ==========================================

        const whatsappMessageId =
          whatsappResponse
            ?.messages?.[0]?.id;


        if (!whatsappMessageId) {

          throw new Error(
            "WhatsApp did not return a message ID"
          );
        }


        // ==========================================
        // Save outgoing message
        // ==========================================

        await saveOutgoingMessage({
          conversationId:
            reminder.conversation_id,

          userId:
            reminder.user_id,

          whatsappMessageId,

          content:
            reminderText,
        });


        // ==========================================
        // Mark reminder completed
        // ==========================================

        await markReminderAsCompleted(
          reminder.id
        );


        console.log(
          "REMINDER SENT SUCCESSFULLY:",
          reminder.id
        );

      } catch (error) {

        console.error(
          "REMINDER ERROR:",
          reminder.id,
          error
        );

        /*
         * مهم:
         *
         * لا نضع completed = true
         * إذا فشل إرسال الرسالة.
         *
         * وبالتالي سيحاول Worker إرسالها
         * مرة أخرى في الدورة القادمة.
         */
      }
    }

  } catch (error) {

    console.error(
      "REMINDER WORKER ERROR:",
      error
    );
  }
}


// ==================================================
// Start Reminder Worker
// ==================================================

export function startReminderWorker() {

  console.log(
    "REMINDER WORKER STARTED"
  );


  // ==========================================
  // Run immediately
  // ==========================================

  void processDueReminders();


  // ==========================================
  // Check every minute
  // ==========================================

  setInterval(
    () => {

      void processDueReminders();

    },
    60 * 1000
  );
}