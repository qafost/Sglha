const OLLAMA_API_URL =
  "https://ollama.com/api/chat";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "gpt-oss:20b";

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaChatResponse {
  message?: {
    role: string;
    content: string;
  };
}

export async function generateAIResponse(
  messages: AIMessage[]
): Promise<string> {
  const apiKey =
    process.env.OLLAMA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OLLAMA_API_KEY is missing"
    );
  }

  const response = await fetch(
    OLLAMA_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: OLLAMA_MODEL,

        messages,

        stream: false,
      }),
    }
  );

  const data =
    await response.json() as OllamaChatResponse;

  console.log(
    "OLLAMA RESPONSE:",
    JSON.stringify(
      data,
      null,
      2
    )
  );

  if (!response.ok) {
    throw new Error(
      `Ollama API error: ${JSON.stringify(data)}`
    );
  }

  const content =
    data.message?.content;

  if (!content) {
    throw new Error(
      "Ollama returned an empty response"
    );
  }

  return content.trim();
}