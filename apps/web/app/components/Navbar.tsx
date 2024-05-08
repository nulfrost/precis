import { type User } from "@precis/database";
import { useFetcher } from "@remix-run/react";

interface NavbarProps {
  user: User | null;
}

export function Navbar(props: NavbarProps) {
  const fetcher = useFetcher();

  return (
    <header className="bg-white shadow-sm px-5 xl:px-0">
      <div className="max-w-7xl mx-auto flex py-3 items-center">
        <div className="flex items-center gap-2">
          <span className="i-lucide-notebook-pen h-5 w-5 inline-block"></span>
          <h1 className="font-semibold text-lg">precis</h1>
        </div>
        <div className="ml-auto flex items-center">
          {props.user !== null ? (
            <>
              <fetcher.Form method="post" action="/auth/logout">
                <button
                  type="submit"
                  className="w-full text-left hover:bg-red-50 text-red-500 rounded-md text-red-500 px-3 py-2 font-medium"
                >
                  Log out
                </button>
              </fetcher.Form>
            </>
          ) : (
            <fetcher.Form method="post" action="/auth/github">
              <button
                type="submit"
                className="bg-black text-white font-semibold py-3 px-4 border-none outline-none rounded-md text-xs flex items-center gap-2 hover:bg-gray-800 ring-gray-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2)"
              >
                <span className="i-lucide-github h-4 w-4 inline-block"></span>
                <span>Log in with Github</span>
              </button>
            </fetcher.Form>
          )}
        </div>
      </div>
    </header>
  );
}
