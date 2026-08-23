import { generateAIResponse } from "./ai.service.js";
import type { AIAnalysis } from "./ai.types.js";

export async function analyzeMessage(
  conversation: {
    role: "system" | "user" | "assistant";
    content: string;
  }[]
): Promise<AIAnalysis> {
  const systemPrompt = `
أنت العقل الذكي لمنصة "سجلها".

مهمتك تحليل رسالة المستخدم وفهم ماذا يريد.

لديك هذه النوايا:

1. conversation
المستخدم يريد التحدث أو مناقشة فكرة فقط.

2. create_record
المستخدم يريد تسجيل أو حفظ فكرة.

3. list_records
المستخدم يريد رؤية السجلات أو الأفكار التي حفظها سابقًا.

4. create_task
المستخدم يريد إنشاء مهمة.

5. create_reminder
المستخدم يريد إنشاء تذكير.

أرجع JSON فقط بدون Markdown.

الشكل:

{
  "intent": "conversation",
  "reply": "رد مناسب للمستخدم"
}

إذا كان المستخدم يريد تسجيل فكرة:

{
  "intent": "create_record",
  "title": "عنوان الفكرة",
  "description": "شرح الفكرة",
  "createTasks": true,
  "createReminder": false
}

إذا لم يكن واضحًا أن المستخدم يريد التسجيل، لا تستخدم create_record.
استمر في النقاش واسأل المستخدم أسئلة تساعدك على فهم الفكرة.

إذا قال المستخدم "سجلها" أو "احفظها" أو معنى واضح مشابه،
اعتبر أنه يريد إنشاء سجل.

إذا طلب Tasks، اجعل createTasks = true.

إذا طلب تذكير، اجعل createReminder = true.

إذا لم يطلب Tasks أو تذكير، لا تفترض أنه طلبهما إلا إذا كان السياق واضحًا جدًا.
`.trim();

  const response = await generateAIResponse([
    {
      role: "system",
      content: systemPrompt,
    },
    ...conversation,
  ]);

  try {
    return JSON.parse(response) as AIAnalysis;
  } catch {
    return {
      intent: "conversation",
      reply: response,
    };
  }
}