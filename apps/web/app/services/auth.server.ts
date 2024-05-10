import { Authenticator } from "remix-auth";
import { sessionStorage } from "@/web/services/session.server";
import { schema, db, eq, type User } from "@precis/database";
import { GitHubStrategy } from "remix-auth-github";
import { generateApiKey } from "../utils/generateApiKey.server";

export const authenticator = new Authenticator<User>(sessionStorage);

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
  },
  async ({ profile }) => {
    // check if user exists in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, profile.displayName),
      columns: {
        id: true,
        username: true,
      },
    });

    // if user does not exist, create a new user and guestbook
    if (!existingUser) {
      const user = await db.transaction(async (tx) => {
        const [user] = await tx
          .insert(schema.users)
          .values({ username: profile.displayName })
          .returning({
            id: schema.users.id,
            username: schema.users.username,
          });

        const [guestbook] = await tx
          .insert(schema.guestbooks)
          .values({
            user_id: user.id,
            api_url: "",
            api_key: generateApiKey(),
          })
          .returning({
            id: schema.guestbooks.id,
          });

        await tx.update(schema.guestbooks).set({
          api_url: `${process.env.API_URL}/api/v1/guestbooks/${guestbook.id}/messages`,
        });

        return user;
      });

      return user;
    }
    return existingUser;
  },
);

authenticator.use(gitHubStrategy);
