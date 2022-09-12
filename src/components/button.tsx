import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-4 font-mono
        vibey text-black
        rounded-3xl border-2 border-black
        transition-all
        hover:border-white hover:text-white"
      {...props}
    >
      {props.children}
    </button>
  );
}
