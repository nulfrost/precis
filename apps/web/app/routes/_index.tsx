import { LinksFunction, MetaFunction } from "@remix-run/node";

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
export default function Index() {
  return <div>test</div>;
}
