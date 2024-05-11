import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { authenticator } from "@/web/services/auth.server";
import { db, eq, schema } from "@precis/database";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { CopyToClipboardButton } from "@/web/routes/dashboard/copy-to-clipboard";
import { CodeBlock } from "@/web/components/CodeBlock";
import * as Tabs from "@radix-ui/react-tabs";

export const meta: MetaFunction = () => [
  {
    title: "Precis | Dashboard",
  },
];
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (user.id) {
    const guestbook = await db.query.guestbooks.findFirst({
      where: eq(schema.guestbooks.user_id, user.id),
      with: {
        messages: true,
      },
    });

    return { user, guestbook };
  }

  // you'll never get here though...
  return { guestbook: null, user: null };
}

const TRIGGER_STYLES =
  "text-gray-500 text-sm uppercase aria-selected:underline font-bold hover:(underline text-indigo-500) underline-offset-8 decoration-2 decoration-indigo-500";

export default function Dashboard() {
  const { user, guestbook } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
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
          {user?.username}&apos;s guestbook
        </h2>
        <p className="text-gray-500 mb-4">
          Welcome to your guestbook! You will be able to manage messages, view
          documentation and modify your guestbook settings.
        </p>
        <span className="inline-block font-bold text-sm uppercase mb-1">
          API Url
        </span>
        <div className="flex items-center mb-4">
          {/* <span className="text-gray-500 items-center bg-gray-100 p-3 inline-block rounded-s-md border border-gray-300 border-r-none">
            {guestbook?.api_url}
          </span> */}
          <input
            type="text"
            name="url"
            disabled
            id="url"
            value={`${guestbook?.api_url}`}
            className="border border-gray-300 rounded-md ring-indigo-300 focus:ring-4 focus-visible:ring-4 outline-none p-3 w-[500px] text-gray-500"
          />
          <CopyToClipboardButton
            copyText={`${guestbook?.api_url}`}
            ariaLabel="Copy guestbook api url to clipboard"
          />
        </div>
        <span className="inline-block font-bold text-sm uppercase mb-1">
          API Key
        </span>
        <div className="flex items-center mb-4">
          <input
            type="text"
            name="key"
            disabled
            id="key"
            value={`${guestbook?.api_key}`}
            className="border border-gray-300 rounded-md ring-indigo-300 focus:ring-4 focus-visible:ring-4 outline-none p-3 w-[500px] text-gray-500"
          />
          <CopyToClipboardButton
            copyText={`${guestbook?.api_key}`}
            ariaLabel="Copy guestbook api key to clipboard"
          />
        </div>
        <fetcher.Form method="POST" action="/regenerate">
          <button
            type="submit"
            className="text-red-500 text-sm rounded-lg py-3 px-4 border-none outline-none ring-red-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2) hover:bg-red-50 flex items-center gap-2"
          >
            <span>Regenerate API Key</span>
            <span className="i-lucide-refresh-ccw h-4 w-4 inline-block"></span>
          </button>
        </fetcher.Form>
      </div>
      <div className="bg-white shadow-sm rounded-md border border-gray-200 px-10 py-6">
        <h2 className="font-semibold text-lg">Documentation</h2>
        <p className="text-gray-500 mb-4">
          Examples of how to use the API to interact with your guestbook.
        </p>
        <Tabs.Root defaultValue="1">
          <Tabs.List className="pb-4 space-x-4">
            <Tabs.Trigger value="1" className={TRIGGER_STYLES}>
              Node.js
            </Tabs.Trigger>
            <Tabs.Trigger value="2" className={TRIGGER_STYLES}>
              Golang
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="1">
            <div className="space-y-4">
              <CodeBlock
                code={`// Fetch all messages from your guestbook
const response = await fetch("${guestbook?.api_url}", {
  headers: {
    "x-precis-key": "${guestbook?.api_key}" // This should be an environment variable and only be used on the server, do not expose this api key
})
const data = await response.json()
console.log({ data })`}
              />
              <CodeBlock
                code={`// Add a new message to your guestbook
await fetch("${guestbook?.api_url}", {
 method: "POST",
 headers: {
   "x-precis-key": "${guestbook?.api_key}" // This should be an environment variable and only be used on the server, do not expose this api key
 },
 body: JSON.stringify({
      name: "John Doe",
      message: "Hello, world!"
  })
})`}
              />
            </div>
          </Tabs.Content>
          <Tabs.Content value="2">
            <div className="space-y-4">
              <CodeBlock
                code={`// Fetch all messages from your guestbook
package main

import (
	"fmt"
	"log"
	"net/http"
	"io"
)

func main() {
	req, err := http.NewRequest(http.MethodGet, "${guestbook?.api_url}", nil)
	if err != nil {
		log.Fatal(err)
	}

	req.header.Set("x-precis-key", "${guestbook?.api_key}") // This should be an environment variable and only be used on the server, do not expose this api key


	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
      log.Fatal(err)
    }

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	fmt.Printf("%s", body)
}`}
              />
              <CodeBlock
                code={`// Add a new message to your guestbook
package main

import (
	"log"
	"net/http"
	"bytes"
)

func main() {
    jsonBody := []byte(\`{"name": "John Doe", "message": "Hello, World!"}\`)
	bodyReader := bytes.NewReader(jsonBody)

	req, err := http.NewRequest(http.MethodPost, "http://localhost:4000/api/v1/guestbooks/ul04oyvi3mz8axxoh0d0axac/messages", bodyReader)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("x-precis-key", "${guestbook?.api_key}") // This should be an environment variable and only be used on the server, do not expose this api key

	client := http.Client{}

	client.Do(req)


	if err != nil {
		log.Fatal(err)
	}
}
`}
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
