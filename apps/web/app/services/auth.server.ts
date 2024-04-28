import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { schema, db, eq, type User } from "@precis/database";
import { GitHubStrategy } from "remix-auth-github";

export const authenticator = new Authenticator<User>(sessionStorage);

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
  },
  async ({ profile }) => {
    // check if user exists in the database
    const existingUser = await db.query.users
      .findFirst({
        where: eq(schema.users.username, profile.displayName),
        columns: {
          id: true,
          username: true,
        },
      })
      .catch((error: unknown) => console.error(error));

    // if user does not exist, create a new user
    if (!existingUser) {
      const newlyCreatedUser = await db
        .insert(schema.users)
        .values({ username: profile.displayName })
        .returning({
          id: schema.users.id,
          username: schema.users.username,
        });

      return newlyCreatedUser.at(0);
    }
    return existingUser;
  },
);

authenticator.use(gitHubStrategy);
