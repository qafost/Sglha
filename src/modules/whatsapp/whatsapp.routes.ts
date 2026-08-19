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

export async function whatsappRoutes(
  app: FastifyInstance
) {
  // Webhook verification
  app.get("/webhooks/whatsapp", async (request, reply) => {
    const query = request.query as {
      "hub.mode"?: string;
      "hub.verify_token"?: string;
      "hub.challenge"?: string;
    };

    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"];

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

    return reply.code(403).send({
      error: "Verification failed",
    });
  });

  // Receive WhatsApp messages
  app.post("/webhooks/whatsapp", async (request, reply) => {
    console.log(
      "WHATSAPP WEBHOOK:",
      JSON.stringify(request.body, null, 2)
    );

    const payload =
      request.body as WhatsAppWebhookPayload;

    const message =
      normalizeWhatsAppMessage(payload);

    if (!message) {
      return reply.code(200).send({
        received: true,
      });
    }

    console.log(
      "NORMALIZED MESSAGE:",
      message
    );

    const result =
      await handleIncomingMessage(message);

    // Ignore duplicate WhatsApp messages
    if (result.duplicate) {
      console.log(
        "DUPLICATE MESSAGE:",
        message.messageId
      );

      return reply.code(200).send({
        received: true,
      });
    }

    const replyText = "يارب ديمان😇 ؟";

    // Send response to WhatsApp
    const sendResult =
      await sendWhatsAppTextMessage({
        phoneNumber: message.phoneNumber,
        message: replyText,
      });

    // Get WhatsApp message ID
    const outgoingWhatsAppMessageId =
      sendResult?.messages?.[0]?.id;

    // Save outgoing message in database
    const savedOutgoingMessage =
      await saveOutgoingMessage(
        result.conversation.id,
        result.user.id,
        replyText,
        outgoingWhatsAppMessageId
      );

    console.log(
      "OUTGOING MESSAGE SAVED:",
      savedOutgoingMessage
    );

    console.log(
      "MESSAGE RESULT:",
      result
    );

    return reply.code(200).send({
      received: true,
    });
  });
}