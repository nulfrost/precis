import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

export const authenticator = new Authenticator<GitHubProfile>(sessionStorage);

import { GitHubProfile, GitHubStrategy } from "remix-auth-github";

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
  },
  async ({ profile }) => {
    return profile;
  },
);

authenticator.use(gitHubStrategy);
