import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/" });
  return null;
}

export function loader() {
  return redirect("/");
}
