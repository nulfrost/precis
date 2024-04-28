import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "@/web/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/" });
  return null;
}

export function loader() {
  return redirect("/");
}
