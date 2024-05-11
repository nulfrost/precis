import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "@unocss/reset/tailwind.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";
import { Navbar } from "./components/Navbar";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "./services/auth.server";
import { Footer } from "./components/Footer";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  return { user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 flex flex-col h-full">
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto flex-1">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
