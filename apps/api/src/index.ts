import { Elysia } from "elysia";
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
      .get(
        "/guestbooks/:username/messages",
        async ({ params: { username } }) => {
          const users = await db.query.users.findFirst({
            columns: {
              id: true,
              username: true,
            },
            with: {
              guestbook: {
                with: {
                  messages: true,
                },
              },
            },
            where: eq(schema.users.username, username),
          });

          return users;
        },
      )
      .post(
        "/guestbooks/:username/messages",
        async ({ params: { username } }) => {
          return "not impl";
        },
      ),
  )
  .listen(process.env.PORT || 4000);
