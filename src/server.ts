import Fastify from "fastify";
import "dotenv/config";


import { db } from "./database/client.js";
import { handleIncomingMessage } from "./modules/messages/message.service.js";

import { whatsappRoutes } from "./modules/whatsapp/whatsapp.routes.js";

const app = Fastify({
  logger: true
});

app.get("/", async () => {
  return {
    name: "Sglha API",
    status: "running"
  };
});

app.get("/health", async () => {
  const result = await db.query("SELECT NOW()");

  return {
    api: "ok",
    database: "ok",
    time: result.rows[0].now
  };
});

app.post("/test/messages", async (request, reply) => {
  const body = request.body as {
    whatsappId: string;
    phoneNumber: string;
    messageId: string;
    type: string;
    content: string;
  };

  console.log("REQUEST BODY:", body);

  const result = await handleIncomingMessage({
    whatsappId: body.whatsappId,
    phoneNumber: body.phoneNumber,
    messageId: body.messageId,
    type: body.type,
    content: body.content
  });

  return reply.send({
    success: true,
    data: result
  });
});

const PORT = Number(process.env.PORT) || 3000;

await app.register(whatsappRoutes);

try {
  await app.listen({
    port: PORT,
    host: "0.0.0.0"
  });

  console.log(
    `Sglha API running on http://localhost:${PORT}`
  );
} catch (error) {
  app.log.error(error);
  process.exit(1);
}






