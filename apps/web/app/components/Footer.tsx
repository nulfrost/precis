export function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-auto border border-t border-gray-100 px-5 2xl:px-0">
      <div className="max-w-7xl mx-auto py-3">
        <ul className="flex justify-end">
          <li>
            <a
              aria-label="Github repository for precis, opens in a new tab"
              href="https://github.com/nulfrost/precis"
              className="text-sm font-bold hover:(underline text-blue-500) text-gray-500"
              rel="noopener noreferrer"
              target="_blank"
            >
              Github
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
