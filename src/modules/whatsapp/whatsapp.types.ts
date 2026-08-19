export interface WhatsAppWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;

  text?: {
    body: string;
  };
}

export interface WhatsAppWebhookPayload {
  object: string;

  entry: Array<{
    id: string;

    changes: Array<{
      field: string;

      value: {
        messaging_product: string;

        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };

        contacts?: Array<{
          profile?: {
            name?: string;
          };

          wa_id: string;
        }>;

        messages?: WhatsAppWebhookMessage[];
      };
    }>;
  }>;
}