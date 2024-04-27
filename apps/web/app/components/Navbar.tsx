import { Link } from "@remix-run/react";

export function Navbar() {
  return (
    <header className="bg-white shadow-sm px-5 xl:px-0">
      <div className="max-w-7xl mx-auto flex py-3 items-center">
        <div className="flex items-center gap-2">
          <span className="i-lucide-notebook-pen h-5 w-5 inline-block"></span>
          <h1 className="font-semibold text-lg">precis</h1>
        </div>
        <div className="ml-auto">
          <Link
            to="#"
            className="bg-black text-white font-semibold py-3 px-4 border-none outline-none rounded-md text-xs flex items-center gap-2 hover:bg-gray-800 duration-150 ring-gray-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2)"
          >
            <span className="i-lucide-github h-4 w-4 inline-block"></span>
            <span>Log in with Github</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
