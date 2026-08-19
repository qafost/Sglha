interface SendTextMessageInput {
  phoneNumber: string;
  message: string;
}

export async function sendWhatsAppTextMessage(
  input: SendTextMessageInput
) {
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId) {
    throw new Error(
      "WHATSAPP_PHONE_NUMBER_ID is missing"
    );
  }

  if (!accessToken) {
    throw new Error(
      "WHATSAPP_ACCESS_TOKEN is missing"
    );
  }

  const url =
    `https://graph.facebook.com/v26.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",

      to: input.phoneNumber,

      type: "text",

      text: {
        preview_url: false,
        body: input.message,
      },
    }),
  });

  const data = await response.json();

  console.log(
    "WHATSAPP SEND RESPONSE:",
    JSON.stringify(data, null, 2)
  );

  if (!response.ok) {
    throw new Error(
      `WhatsApp API error: ${JSON.stringify(data)}`
    );
  }

  return data;
}