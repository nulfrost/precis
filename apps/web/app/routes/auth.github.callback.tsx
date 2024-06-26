import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "@/web/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate("github", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  });
}
