import { LoaderFunctionArgs } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { authenticator } from "@/web/services/auth.server";
import { loader as rootLoader } from "@/web/root";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  return null;
}

export default function Dashboard() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
  return (
    <div className="mt-5 px-5 xl:px-0">
      <div className="flex items-baseline">
        <h1 className="font-semibold text-xl mb-4">Dashboard</h1>
        {/* <button className="ml-auto bg-black text-white rounded-md py-2 px-4 shadow-sm border-none outline-none focus-visible:(focus:(ring-4 ring-gray-700)) text-sm hover:bg-gray-800 duration-150 flex items-center gap-2">
          <span>Export guestbook</span>
          <span className="h-4 w-4 i-lucide-download inline-block"></span>
        </button> */}
      </div>
      <div className="bg-white shadow-sm rounded-md border border-gray-200 px-10 py-6 mb-4">
        <h2 className="font-semibold text-lg">
          {data?.user?.username}&apos;s guestbook
        </h2>
        <p className="text-gray-500 mb-4">
          Welcome to your guestbook! You will be able to manage messages as well
          as your guestbook settings on this page.
        </p>
        <span className="inline-block font-bold text-sm uppercase mb-1">
          API Url
        </span>
        <div className="flex items-center mb-4">
          <span className="text-gray-500 items-center bg-gray-100 p-3 inline-block rounded-s-md border border-gray-300 border-r-none">
            https://precis.dev/api/v1/guestbook/
          </span>
          <input
            type="text"
            name="url"
            disabled
            id="url"
            value={`${data?.user?.username}`}
            className="border border-gray-300 rounded-e-md ring-indigo-300 focus:ring-4 focus-visible:ring-4 outline-none p-3"
          />
          <button
            aria-label="Copy guestbook api url to clipboard"
            disabled={isCopiedToClipboard}
            aria-disabled={isCopiedToClipboard}
            className="bg-indigo-600 text-white rounded-lg py-4 px-4 shadow-sm border-none outline-none ring-indigo-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2) hover:bg-indigo-500 duration-150 flex items-center ml-1"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://precis.dev/api/v1/guestbook/${data?.user?.username}`,
              );
              setIsCopiedToClipboard(true);
              setTimeout(() => {
                setIsCopiedToClipboard(false);
              }, 4000);
            }}
          >
            {isCopiedToClipboard ? (
              <span className={`h-5 w-5 i-lucide-check inline-block`}></span>
            ) : (
              <span className={`h-5 w-5 i-lucide-copy inline-block`}></span>
            )}
          </button>
        </div>
        <span className="inline-block font-bold text-sm uppercase mb-1">
          API Key
        </span>
        <div className="flex items-center mb-4 w-[540px]">
          <input
            type="text"
            name="key"
            disabled
            id="key"
            value="FuGRzBUTVwEvui1BQ2BUpK3PT5LJjztZ"
            className="border border-gray-300 rounded-md ring-indigo-300 focus:ring-4 focus-visible:ring-4 outline-none p-3 flex-1"
          />
          <button
            aria-label="Re-generate API key"
            className="bg-indigo-600 text-white rounded-lg py-4 px-4 shadow-sm border-none outline-none ring-indigo-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2) hover:bg-indigo-500 duration-150 flex items-center ml-1"
            onClick={() => {}}
          >
            <span
              className={`h-5 w-5 i-lucide-refresh-ccw inline-block`}
            ></span>
          </button>
        </div>
      </div>
      {/* <div className="bg-white shadow-sm rounded-md border border-gray-200 px-10 py-6">
        <h2 className="font-semibold text-lg">Delete Guestbook</h2>
        <p className="text-gray-500 mb-4">
          Deleting your guestbook will permanently remove all of your messages,
          be sure to export them first if you want to keep them.
        </p>
        <button
          className="bg-red-500 text-white rounded-md py-2 px-4 shadow-sm border-none outline-none focus-visible:(focus:(ring-4 ring-red-300)) ring-offset-2 text-sm hover:bg-red-600 duration-150 flex items-center gap-2"
          onClick={() => alert("should open a modal")}
        >
          <span>Delete guestbook</span>
          <span className="h-4 w-4 i-lucide-trash inline-block"></span>
        </button>
      </div> */}
    </div>
  );
}
