import type {
  WhatsAppWebhookPayload,
  WhatsAppWebhookMessage
} from "./whatsapp.types.js";

export interface NormalizedMessage {
  whatsappId: string;
  phoneNumber: string;
  messageId: string;
  type: string;
  content: string;
}

export function normalizeWhatsAppMessage(
  payload: WhatsAppWebhookPayload
): NormalizedMessage | null {
  const change =
    payload.entry?.[0]?.changes?.[0];

  const value = change?.value;

  const message: WhatsAppWebhookMessage | undefined =
    value?.messages?.[0];

  if (!message) {
    return null;
  }

  const contact = value?.contacts?.[0];

  const phoneNumber =
    contact?.wa_id ?? message.from;

  let content = "";

  if (
    message.type === "text" &&
    message.text
  ) {
    content = message.text.body;
  }

  return {
    whatsappId: message.from,
    phoneNumber,
    messageId: message.id,
    type: message.type,
    content
  };
}