import { findOrCreateUser } from "../users/user.service.js";
import { getOrCreateConversation } from "../conversations/conversation.service.js";

import {
  createMessage,
  findMessageByWhatsAppId,
  findRecentMessages
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
  content: message.content
});

const recentMessages =
  await findRecentMessages(conversation.id);

  console.log(
  "RECENT MESSAGES:",
  recentMessages
);

return {
  user,
  conversation,
  message: savedMessage,
  recentMessages,
  duplicate: false,
};
}

export async function saveOutgoingMessage({
  conversationId,
  userId,
  whatsappMessageId,
  content,
}: {
  conversationId: string;
  userId: string;
  whatsappMessageId: string;
  content: string;
}) {
  return createMessage({
    conversationid: conversationId,
    userid: userId,
    whatsappMessageId,
    direction: "outgoing",
    messageType: "text",
    content,
  });
}