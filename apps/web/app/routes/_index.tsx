import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { authenticator } from "../services/auth.server";

export const meta: MetaFunction = () => [
  {
    title: "Precis | Home",
  },
  {
    name: "description",
    content:
      "precis makes it easy for you to create and add your own personal guestbook to your website using our API.",
  },
  {
    name: "keywords",
    content: "guestbook, personal website, api",
  },
  {
    name: "robots",
    content: "index,follow",
  },
  {
    name: "googlebot",
    content: "index,follow",
  },
  {
    property: "og:title",
    content: "Precis | Home",
  },
  {
    property: "og:description",
    content:
      "precis makes it easy for you to create and add your own personal guestbook to your website.",
  },
];

export const links: LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://precis.dev/",
  },
  {
    rel: "icon",
    href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
`,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
  return null;
}

export default function Index() {
  return (
    <div className="mt-20 px-5 2xl:px-0">
      <section className="text-center mb-40">
        <h1 className="font-bold text-2xl xl:text-4xl">Precis</h1>
        <p className="text-md xl:text-xl">
          An easy way for you to create and add your own personal guestbook to
          your website using our API.
        </p>
      </section>
      <section>
        <h2 className="font-bold text-xl xl:text-2xl mt-10 text-center mb-4">
          Getting started is easy
        </h2>
        <ul className="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {[
            {
              text: "Create an account by logging in with your GitHub account",
              icon: "github",
            },
            {
              text: "Copy your uniquely generated credentials into your project",
              icon: "copy",
            },
            {
              text: "Make requests to or pull data from your own API endpoint",
              icon: "grip",
            },
          ].map((step, index) => (
            <li
              key={index}
              className="bg-white shadow-sm border border-gray-100 rounded-md p-5"
            >
              <span
                className={`i-lucide-${step.icon} inline-block h-6 w-6`}
              ></span>
              <p className="text-gray-500">{step.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
