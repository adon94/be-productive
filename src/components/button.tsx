import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-4 font-mono
        vibey text-black
        rounded-3xl border-2 border-black"
      {...props}
    >
      {props.children}
    </button>
  );
}
