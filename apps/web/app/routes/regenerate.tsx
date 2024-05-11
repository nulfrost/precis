import { ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { authenticator } from "../services/auth.server";
import { db, eq, schema } from "@precis/database";
import { generateApiKey } from "../utils/generateApiKey.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return json(
      {
        data: {
          status: 401,
          title: "Error: unauthorized",
          detail: "Invalid session.",
        },
      },
      { status: 401 },
    );
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(schema.users.id, user.id!),
    with: {
      guestbook: {
        columns: {
          id: true,
        },
      },
    },
  });

  await db
    .update(schema.guestbooks)
    .set({
      api_key: generateApiKey(),
    })
    .where(eq(schema.guestbooks.id, currentUser!.guestbook.id!));

  return json(
    {
      data: {
        status: 200,
        title: "Success: API key successfully re-generated!",
        detail:
          "Your API key has been successfully re-generated, please make sure to update your API key in your application.",
      },
    },
    { status: 200 },
  );
}

export function loader() {
  return redirect("/dashboard");
}
