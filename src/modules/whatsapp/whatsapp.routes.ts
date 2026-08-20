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

export async function whatsappRoutes(
  app: FastifyInstance
) {
  // ==========================================
  // WhatsApp Webhook Verification
  // ==========================================

  app.get(
    "/webhooks/whatsapp",
    async (request, reply) => {
      const query = request.query as {
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
          error: "Verification failed",
        });
    }
  );

  // ==========================================
  // Receive WhatsApp Messages
  // ==========================================

  app.post(
    "/webhooks/whatsapp",
    async (request, reply) => {
      console.log(
        "WHATSAPP WEBHOOK:",
        JSON.stringify(
          request.body,
          null,
          2
        )
      );

      const payload =
        request.body as WhatsAppWebhookPayload;

      // ------------------------------------------
      // Normalize WhatsApp message
      // ------------------------------------------

      const message =
        normalizeWhatsAppMessage(payload);

      // WhatsApp can send webhook events
      // that are not actual messages.
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

      // ------------------------------------------
      // Save incoming message
      // ------------------------------------------

      const result =
        await handleIncomingMessage(
          message
        );

      console.log(
        "MESSAGE RESULT:",
        result
      );

      // ------------------------------------------
      // Ignore duplicate messages
      // ------------------------------------------

      if (result.duplicate) {
        return reply
          .code(200)
          .send({
            received: true,
            duplicate: true,
          });
      }

      // ------------------------------------------
      // Generate response
      // ------------------------------------------

      const responseText =
        await generateMessageResponse({
          messages:
            result.recentMessages,
        });

      console.log(
        "GENERATED RESPONSE:",
        responseText
      );

      // ------------------------------------------
      // Send response to WhatsApp
      // ------------------------------------------

      const whatsappResponse =
        await sendWhatsAppTextMessage({
          phoneNumber:
            message.phoneNumber,

          message:
            responseText,
        });

      // ------------------------------------------
      // Save outgoing message
      // ------------------------------------------

      const outgoingMessage =
        await saveOutgoingMessage({
          conversationId:
            result.conversation.id,

          userId:
            result.user.id,

          whatsappMessageId:
            whatsappResponse.messages?.[0]?.id,

          content:
            responseText,
        });

      console.log(
        "OUTGOING MESSAGE SAVED:",
        outgoingMessage
      );

      // ------------------------------------------
      // Return success to Meta
      // ------------------------------------------

      return reply
        .code(200)
        .send({
          received: true,
        });
    }
  );
}