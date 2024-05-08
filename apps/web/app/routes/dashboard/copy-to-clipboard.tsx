import { useState } from "react";

interface CopyToClipboardButtonProps {
  ariaLabel: string;
  copyText: string;
}

export function CopyToClipboardButton(props: CopyToClipboardButtonProps) {
  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
  return (
    <button
      aria-label={props.ariaLabel}
      disabled={isCopiedToClipboard}
      aria-disabled={isCopiedToClipboard}
      className="bg-indigo-600 text-white rounded-lg py-4 px-4 shadow-sm border-none outline-none ring-indigo-400 focus:(ring-4 ring-offset-2) focus-visble:(ring-4 ring-offset-2) hover:bg-indigo-500 duration-150 flex items-center ml-1"
      onClick={() => {
        navigator.clipboard.writeText(`${props.copyText}`);
        setIsCopiedToClipboard(true);
        setTimeout(() => {
          setIsCopiedToClipboard(false);
        }, 2000);
      }}
    >
      {isCopiedToClipboard ? (
        <span className={`h-5 w-5 i-lucide-check inline-block`}></span>
      ) : (
        <span className={`h-5 w-5 i-lucide-copy inline-block`}></span>
      )}
    </button>
  );
}
