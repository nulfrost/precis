import { Elysia, t } from "elysia";
import { db, eq, schema } from "@precis/database";
import logixlysia from "logixlysia";

new Elysia({ name: "Precis API" })
  .use(
    logixlysia({
      config: {
        ip: true,
        customLogFormat:
          "{now} {level} {duration} {method} {pathname} {status} {message} {ip}",
      },
    }),
  )

  .group("/api/v1", (app) =>
    app
      .guard({
        params: t.Object({
          guestbookId: t.String(),
        }),
        headers: t.Object({
          "X-Precis-Key": t.String(),
        }),
        // @ts-ignore
        async beforeHandle({ set, params: { guestbookId }, headers }) {
          // have to check if api key is valid and exists
          if (!headers["X-Precis-Key"]) {
            set.status = "Unauthorized";
            return {
              data: {
                status: "401",
                title: "Error: unauthorized",
                detail:
                  "Invalid API key provided. Please provide a valid API key to access this resource.",
              },
            };
          }
          // have to check if guestbook exists
          const guestbook = await db.query.guestbooks.findFirst({
            where: eq(schema.guestbooks.id, guestbookId),
          });

          if (typeof guestbook === "undefined") {
            set.status = "Bad Request";
            return {
              data: {
                status: "400",
                title: "Error: could not find guestbook",
                detail: `The guestbook with the id of: "${guestbook}" could not be found on the server. Please double check your API url.`,
              },
            };
          }
        },
      })
      .get(
        "/guestbooks/:guestbookId/messages",
        async ({ params: { guestbookId } }) => {
          const guestbook = await db.query.guestbooks.findFirst({
            where: eq(schema.guestbooks.id, guestbookId),
            with: {
              messages: {
                columns: {
                  id: true,
                  username: true,
                  message: true,
                  created_at: true,
                  updated_at: true,
                },
              },
            },
          });
          return {
            data: guestbook?.messages,
          };
        },
      )
      .post(
        "/guestbooks/:guestbookId/messages",
        async ({ params: { guestbookId }, body, set }) => {
          await db.insert(schema.messages).values({
            username: body.username,
            message: body.message,
            guestbook_id: guestbookId,
          });

          set.status = 201;

          return {
            data: {
              status: "201",
              title: "Success: message created",
              detail: "The message has been successfully created.",
            },
          };
        },
        {
          body: t.Object({
            username: t.String(),
            message: t.String(),
          }),
        },
      ),
  )
  .listen(process.env.PORT || 4000);
