import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(
  () => {
    return import("react-quill");
  },
  { ssr: false }
);
// import "react-quill/dist/quill.bubble.css";

export default function JournalEditor() {
  const [value, setValue] = useState("");

  return <ReactQuill theme="bubble" value={value} onChange={setValue} />;
}
