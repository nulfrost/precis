import { LoaderFunctionArgs } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { loader as rootLoader } from "~/root";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  return null;
}

export default function Dashboard() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  console.log({ data });
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
        <div className="flex justify-center bg-gray-50 border border-dashed border-gray-200 rounded-md py-10 items-center flex-col">
          <h2 className="font-bold text-lg mb-2">No guestbook yet</h2>
          <p className="text-gray-500 mb-4 max-w-[60ch] text-center">
            Creating a guestbook will give you an API key as well as a unique
            endpoint you can use to add messages to your guestbook.
          </p>
          <button
            className="bg-indigo-600 text-white rounded-md py-2 px-4 shadow-sm border-none outline-none ring-indigo-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2) text-sm hover:bg-indigo-500 duration-150 flex items-center gap-2"
            onClick={() => alert("should open a modal")}
          >
            <span>create guestbook</span>
            <span className="h-4 w-4 i-lucide-plus inline-block"></span>
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
