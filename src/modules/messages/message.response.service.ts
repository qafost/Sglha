import type {
  Message,
} from "./message.repository.js";

import {
  generateAIResponse,
} from "../../ai/ai.service.js";

interface GenerateResponseInput {
  messages: Message[];
}

export async function generateMessageResponse(
  input: GenerateResponseInput
): Promise<string> {
  const conversationMessages =
    input.messages.map((message) => ({
      role:
        message.direction === "incoming"
          ? "user" as const
          : "assistant" as const,

      content:
        message.content ?? "",
    }));

  const messages = [
    {
      role: "system" as const,

      content: `
أنت مساعد ذكي تابع لمنصة سجلها.

تحدث باللغة العربية المصرية بشكل طبيعي وواضح.

كن مختصرًا ومفيدًا.

لا تدّعي أنك إنسان.

إذا لم تعرف الإجابة، قل بوضوح أنك لا تعرف.

حافظ على سياق المحادثة السابقة.

لا تكرر نفس الرد بشكل آلي.

ساعد المستخدم على الوصول إلى هدفه خطوة بخطوة.
      `.trim(),
    },

    ...conversationMessages,
  ];

  return generateAIResponse(messages);
}