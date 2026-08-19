import { findOrCreateUser } from "../users/user.service.js";
import { getOrCreateConversation } from "../conversations/conversation.service.js";

import {
  createMessage,
  findMessageByWhatsAppId,
} from "./message.repository.js";

interface IncomingWhatsAppMessage {
  whatsappId: string;
  phoneNumber: string;
  messageId: string;
  type: string;
  content: string;
}

export async function handleIncomingMessage(
  message: IncomingWhatsAppMessage
) {
  const user = await findOrCreateUser(
    message.whatsappId,
    message.phoneNumber
  );

  const conversation = await getOrCreateConversation(
    user.id
  );

  const existingMessage =
    await findMessageByWhatsAppId(
      message.messageId
    );

  if (existingMessage) {
    return {
      user,
      conversation,
      message: existingMessage,
      duplicate: true,
    };
  }

  const savedMessage = await createMessage({
    conversationid: conversation.id,
    userid: user.id,
    whatsappMessageId: message.messageId,
    direction: "incoming",
    messageType: message.type,
    content: message.content,
  });

  return {
    user,
    conversation,
    message: savedMessage,
    duplicate: false,
  };
}

export async function saveOutgoingMessage(
  conversationId: string,
  userId: string,
  content: string,
  whatsappMessageId?: string
) {
  const savedMessage = await createMessage({
    conversationid: conversationId,
    userid: userId,
    whatsappMessageId,
    direction: "outgoing",
    messageType: "text",
    content,
  });

  return savedMessage;
}