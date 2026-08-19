import {
  createConversation,
  findLatestConversation,
  type Conversation
} from "./conversation.repository.js";

export async function getOrCreateConversation(
  userId: string
): Promise<Conversation> {
  const existingConversation =
    await findLatestConversation(userId);

  if (existingConversation) {
    return existingConversation;
  }

  return createConversation(userId);
}