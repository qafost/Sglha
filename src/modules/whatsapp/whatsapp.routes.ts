import type { FastifyInstance } from "fastify";

import {
  normalizeWhatsAppMessage,
} from "../whatsapp/whatsapp.adapter.js";

import {
  handleIncomingMessage,
  saveOutgoingMessage,
} from "../messages/message.service.js";

import type {
  WhatsAppWebhookPayload,
} from "../whatsapp/whatsapp.types.js";

import {
  sendWhatsAppTextMessage,
} from "../whatsapp/whatsapp.client.js";

import {
  generateMessageResponse,
} from "../messages/message.response.service.js";

import {
  createUserRecord,
  deleteUserRecords,
  getUserRecords,
} from "../records/record.service.js";


// ==================================================
// Send multiple WhatsApp messages
// ==================================================

async function sendMessages(
  phoneNumber: string,
  userId: string,
  conversationId: string,
  messages: string[]
) {

  for (const message of messages) {

    const text =
      message.trim();

    if (!text) {
      continue;
    }

    const whatsappResponse =
      await sendWhatsAppTextMessage({
        phoneNumber,
        message: text,
      });

    const whatsappMessageId =
      whatsappResponse
        ?.messages?.[0]?.id;

    await saveOutgoingMessage({
      conversationId,

      userId,

      whatsappMessageId,

      content: text,
    });

    // منع إرسال الرسائل بسرعة شديدة
    // إلى WhatsApp
    await new Promise(
      (resolve) =>
        setTimeout(resolve, 300)
    );
  }
}


// ==================================================
// WhatsApp Routes
// ==================================================

export async function whatsappRoutes(
  app: FastifyInstance
) {

  // ==================================================
  // WhatsApp Webhook Verification
  // ==================================================

  app.get(
    "/webhooks/whatsapp",
    async (
      request,
      reply
    ) => {

      const query =
        request.query as {
          "hub.mode"?: string;

          "hub.verify_token"?: string;

          "hub.challenge"?: string;
        };


      const mode =
        query["hub.mode"];

      const token =
        query["hub.verify_token"];

      const challenge =
        query["hub.challenge"];


      const verifyToken =
        process.env.WHATSAPP_VERIFY_TOKEN;


      if (
        mode === "subscribe" &&
        token === verifyToken
      ) {

        return reply
          .type("text/plain")
          .send(challenge);
      }


      return reply
        .code(403)
        .send({
          error:
            "Verification failed",
        });
    }
  );


  // ==================================================
  // Receive WhatsApp Messages
  // ==================================================

  app.post(
    "/webhooks/whatsapp",
    async (
      request,
      reply
    ) => {

      try {

        // ==================================================
        // Raw Webhook
        // ==================================================

        console.log(
          "WHATSAPP WEBHOOK:",
          JSON.stringify(
            request.body,
            null,
            2
          )
        );


        const payload =
          request.body as
            WhatsAppWebhookPayload;


        // ==================================================
        // Normalize
        // ==================================================

        const message =
          normalizeWhatsAppMessage(
            payload
          );


        // WhatsApp ممكن تبعت
        // status events بدل messages
        if (!message) {

          return reply
            .code(200)
            .send({
              received: true,
            });
        }


        console.log(
          "NORMALIZED MESSAGE:",
          message
        );


        // ==================================================
        // Save Incoming Message
        // ==================================================

        const result =
          await handleIncomingMessage(
            message
          );


        console.log(
          "MESSAGE RESULT:",
          result
        );


        // ==================================================
        // Duplicate Message
        // ==================================================

        if (
          result.duplicate
        ) {

          console.log(
            "DUPLICATE MESSAGE"
          );


          return reply
            .code(200)
            .send({
              received: true,

              duplicate: true,
            });
        }


        // ==================================================
        // AI
        // ==================================================

        const response =
          await generateMessageResponse({
            messages:
              result.recentMessages ?? [],
          });


        console.log(
          "AI RESPONSE:",
          JSON.stringify(
            response,
            null,
            2
          )
        );
// ==================================================
// CREATE RECORD
// ==================================================

if (
  response.action === "create_record"
) {

  // ----------------------------------------------
  // Make sure AI returned a record
  // ----------------------------------------------

  if (!response.record) {

    await sendMessages(
      message.phoneNumber,

      result.user.id,

      result.conversation.id,

      [
        response.reply ||
        "مش قادر أجهز السجل دلوقتي، حاول تاني."
      ]
    );

    return reply
      .code(200)
      .send({
        received: true,
      });
  }


  // ----------------------------------------------
  // Save Record
  // ----------------------------------------------

  const savedRecord =
    await createUserRecord({

      userId:
        result.user.id,

      title:
        response.record.title,

      description:
        response.record.description,

      tasks:
        response.record.tasks ?? [],

      reminder:
        response.record.reminder ?? null,

      conversationId: 
        result.conversation.id,
    });


  console.log(
    "RECORD CREATED:",
    savedRecord
  );


  // ----------------------------------------------
  // Build Confirmation
  // ----------------------------------------------

  const confirmationParts: string[] = [];


  confirmationParts.push(
    `تم حفظ السجل بنجاح.\n\n` +
    `📌 ${savedRecord.record.title}\n\n` +
    `📖 ${savedRecord.record.description}`
  );


  // ----------------------------------------------
  // Tasks
  // ----------------------------------------------

  if (
    savedRecord.tasks.length > 0
  ) {

    let tasksText =
      `\n\n📝 المهام:\n`;

    savedRecord.tasks.forEach(
      (task, index) => {

        tasksText +=
          `${index + 1}. ${task.title}`;

        if (
          task.description
        ) {

          tasksText +=
            ` — ${task.description}`;
        }

        tasksText += "\n";
      }
    );

    confirmationParts.push(
      tasksText
    );
  }


  // ----------------------------------------------
  // Reminder
  // ----------------------------------------------

  if (
    savedRecord.reminder
  ) {

    const reminderDate =
      new Date(
        savedRecord.reminder.remind_at
      );


    confirmationParts.push(
      `⏰ التذكير:\n` +
      reminderDate.toLocaleString(
        "ar-EG",
        {
          timeZone:
            "Africa/Cairo",
        }
      )
    );
  }


  // ----------------------------------------------
  // Send Confirmation
  // ----------------------------------------------

  await sendMessages(
    message.phoneNumber,

    result.user.id,

    result.conversation.id,

    confirmationParts
  );


  return reply
    .code(200)
    .send({
      received: true,
    });
}

if (
  response.action === "delete_records"
) {

  console.log(
    "DELETING USER RECORDS"
  );

  await deleteUserRecords(
    result.user.id
  );

  await sendMessages(
    message.phoneNumber,

    result.user.id,

    result.conversation.id,

    [
      response.reply ||
      "تم حذف كل السجلات المحفوظة عندك."
    ]
  );

  return reply
    .code(200)
    .send({
      received: true,
    });
}

        // ==================================================
        // LIST RECORDS
        // ==================================================

        if (
          response.action ===
          "list_records"
        ) {

          console.log(
            "LISTING USER RECORDS"
          );


          const records =
            await getUserRecords(
              result.user.id
            );


          // ------------------------------------------------
          // No Records
          // ------------------------------------------------

          if (
            records.length === 0
          ) {

            await sendMessages(
              message.phoneNumber,

              result.user.id,

              result.conversation.id,

              [
                "لسه مفيش أي سجلات محفوظة عندك."
              ]
            );


            return reply
              .code(200)
              .send({
                received: true,
              });
          }


          // ------------------------------------------------
          // Build Messages
          // ------------------------------------------------

          const messages:
            string[] = [];


          messages.push(
            `📚 عندك ${records.length} سجل محفوظ.`
          );


          for (
            let i = 0;
            i < records.length;
            i++
          ) {

            const item =
              records[i];


            let text =
              `📌 السجل ${i + 1}\n\n`;


            // ----------------------------------------------
            // Title
            // ----------------------------------------------

            text +=
              `العنوان:\n` +
              `${item.record.title}\n\n`;


            // ----------------------------------------------
            // Description
            // ----------------------------------------------

            text +=
              `📖 الشرح:\n` +
              `${item.record.description}\n`;


            // ----------------------------------------------
            // Tasks
            // ----------------------------------------------

            if (
              item.tasks.length > 0
            ) {

              text +=
                `\n📝 المهام:\n`;


              item.tasks.forEach(
                (
                  task,
                  index
                ) => {

                  text +=
                    `${index + 1}. ${task.title}`;


                  if (
                    task.description
                  ) {

                    text +=
                      ` — ${task.description}`;
                  }


                  if (
                    task.due_at
                  ) {

                    const dueDate =
                      new Date(
                        task.due_at
                      );


                    text +=
                      `\n   📅 الموعد: ` +
                      `${dueDate.toLocaleString(
                        "ar-EG",
                        {
                          timeZone:
                            "Africa/Cairo",
                        }
                      )}`;
                  }


                  text += "\n";
                }
              );

            } else {

              text +=
                `\n📝 المهام:\n` +
                `لا توجد مهام لهذا السجل.`;
            }


            // ----------------------------------------------
            // Reminder
            // ----------------------------------------------

            if (
              item.reminder
            ) {

              const reminderDate =
                new Date(
                  item.reminder.remind_at
                );


              text +=
                `\n⏰ التذكير:\n` +
                `${reminderDate.toLocaleString(
                  "ar-EG",
                  {
                    timeZone:
                      "Africa/Cairo",
                  }
                )}`;


              if (
                item.reminder.message
              ) {

                text +=
                  `\n${item.reminder.message}`;
              }

            } else {

              text +=
                `\n⏰ التذكير:\n` +
                `لا يوجد تذكير.`;
            }


            // ----------------------------------------------
            // Add Record Message
            // ----------------------------------------------

            messages.push(
              `━━━━━━━━━━━━━━\n\n${text}`
            );
          }


          // ==================================================
          // Send Records
          // ==================================================

          await sendMessages(
            message.phoneNumber,

            result.user.id,

            result.conversation.id,

            messages
          );


          return reply
            .code(200)
            .send({
              received: true,
            });
        }


        // ==================================================
        // CHAT / CREATE_RECORD
        // ==================================================

        if (
          response.reply
        ) {

          await sendMessages(
            message.phoneNumber,

            result.user.id,

            result.conversation.id,

            [
              response.reply
            ]
          );
        }


        // ==================================================
        // Success
        // ==================================================

        return reply
          .code(200)
          .send({
            received: true,
          });

      } catch (
        error
      ) {

        // ==================================================
        // Error
        // ==================================================

        console.error(
          "WHATSAPP WEBHOOK ERROR:",
          error
        );


        // مهم جدًا:
        // نرجع 200 لـ Meta حتى لا تعيد
        // إرسال نفس الـWebhook مرات كثيرة.

        return reply
          .code(200)
          .send({
            received: true,

            error: true,
          });
      }
    }
  );
}