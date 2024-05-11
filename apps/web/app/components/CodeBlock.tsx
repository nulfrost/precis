import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CopyToClipboardButton } from "../routes/dashboard/copy-to-clipboard";

interface CodeBlockProps {
  code: string;
}

export function CodeBlock(props: CodeBlockProps) {
  return (
    <div className="flex items-start">
      <SyntaxHighlighter
        language="js"
        wrapLongLines
        className="border border-gray-200 rounded-md !text-sm !m-0"
      >
        {props.code}
      </SyntaxHighlighter>
      <CopyToClipboardButton
        ariaLabel="Copy code to clipboard"
        copyText={props.code}
      />
    </div>
  );
}
