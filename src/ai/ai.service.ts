interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const OLLAMA_API_KEY =
  process.env.OLLAMA_API_KEY;

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL;

const OLLAMA_URL =
  "https://ollama.com/api/chat";

export async function generateAIResponse(
  messages: AIMessage[]
): Promise<string> {

  if (!OLLAMA_API_KEY) {
    throw new Error(
      "OLLAMA_API_KEY is missing"
    );
  }

  if (!OLLAMA_MODEL) {
    throw new Error(
      "OLLAMA_MODEL is missing"
    );
  }

  const response = await fetch(
    OLLAMA_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "Authorization":
          `Bearer ${OLLAMA_API_KEY}`,
      },

      body: JSON.stringify({
        model: OLLAMA_MODEL,

        messages,

        stream: false,
      }),
    }
  );

  const data = await response.json();

  console.log(
    "OLLAMA RESPONSE:",
    JSON.stringify(data, null, 2)
  );

  if (!response.ok) {
    throw new Error(
      `Ollama API error: ${JSON.stringify(data)}`
    );
  }

  const content =
    data?.message?.content;

  if (
    typeof content !== "string" ||
    !content.trim()
  ) {
    throw new Error(
      "Ollama returned an empty response"
    );
  }

  return content.trim();
}