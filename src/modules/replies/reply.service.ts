export interface ReplyContext {
  content: string;
}

export function generateReply(
  context: ReplyContext
): string {
  const content = context.content.trim().toLowerCase();

  if (
    content.includes("اهلا") ||
    content.includes("أهلا") ||
    content.includes("hello") ||
    content.includes("hi")
  ) {
    return "أهلاً بيك، ازاي أقدر أساعدك؟";
  }

  if (
    content.includes("عامل اي") ||
    content.includes("عامل إيه")
  ) {
    return "تمام الحمد لله، أقدر أساعدك في إيه؟";
  }

  return "وصلتني رسالتك، أقدر أساعدك إزاي؟";
}