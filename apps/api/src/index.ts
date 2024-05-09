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
        // @ts-ignore
        async beforeHandle({ set, params: { username } }) {
          const user = await db.query.users.findFirst({
            where: eq(schema.users.username, username),
          });

          if (typeof user === "undefined") {
            set.status = "Bad Request";
            return {
              data: {
                status: "400",
                title: "Error: could not find username",
                detail: `The parameter username: "${username}" could not be found on the server. Please make sure the username is correct and try again.`,
              },
            };
          }
        },
      })
      .get(
        "/guestbooks/:username/messages",
        async ({ params: { username } }) => {
          const user = await db.query.users.findFirst({
            with: {
              guestbook: {
                columns: { id: true },
              },
            },
            where: eq(schema.users.username, username),
          });

          const guestbook = await db.query.guestbooks.findFirst({
            where: eq(schema.guestbooks.id, user!.guestbook.id),
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
        "/guestbooks/:username/messages",
        async ({ params: { username }, body, set }) => {
          const user = await db.query.users.findFirst({
            with: { guestbook: true },
            where: eq(schema.users.username, username),
          });
          await db.insert(schema.messages).values({
            username: body.username,
            message: body.message,
            guestbook_id: user?.guestbook?.id,
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
