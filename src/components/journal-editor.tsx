import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
const ReactQuill = dynamic(
  () => {
    return import("react-quill");
  },
  { ssr: false }
);

type JournalEditorProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleKeyPress: (arg0: KeyboardEvent) => void;
};

export default function JournalEditor({
  value,
  setValue,
  handleKeyPress,
}: JournalEditorProps) {
  return (
    <ReactQuill
      theme="bubble"
      value={value}
      onChange={setValue}
      placeholder="Say something..."
      scrollingContainer={"#scrolling-container"}
      onKeyUp={handleKeyPress}
    />
  );
}
