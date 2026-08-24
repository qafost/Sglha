import type { FastifyInstance } from "fastify";

import {
  getUserRecordsWithDetails,
} from "./record.service.js";

export async function recordsRoutes(
  app: FastifyInstance
) {

  app.get(
    "/api/records",
    async (request, reply) => {

      try {

        const query =
          request.query as {
            userId?: string;
          };

        const userId =
          query.userId;

        if (!userId) {
          return reply
            .code(400)
            .send({
              error: "userId is required",
            });
        }

        const records =
          await getUserRecordsWithDetails(
            userId
          );

        return reply.send({
          records,
        });

      } catch (error) {

        console.error(
          "GET RECORDS ERROR:",
          error
        );

        return reply
          .code(500)
          .send({
            error:
              "Failed to get records",
          });
      }
    }
  );
}