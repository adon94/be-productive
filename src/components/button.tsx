import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-4 font-mono
        bg-soft
        transition-all"
      {...props}
    >
      {props.children}
    </button>
  );
}
