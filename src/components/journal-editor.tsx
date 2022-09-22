import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
const ReactQuill = dynamic(
  () => {
    return import("react-quill");
  },
  { ssr: false }
);

function genCalLink(title: string) {
  return (
    "http://www.google.com" +
    "/calendar/event" +
    "?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent(title) +
    "&location=" +
    "&details=Added%20from%20Mortal"
  );
}

type JournalEditorProps = {
  value: string;
  setValue: (value: string, arg1: any, arg2: any, arg3: any) => void;
  handleKeyPress?: (arg0: KeyboardEvent) => void;
  save: () => void;
};

export default function JournalEditor({
  value,
  setValue,
  handleKeyPress,
  save,
}: JournalEditorProps) {
  const selRef = useRef(null);
  const modules = useMemo(() => {
    return {
      toolbar: false,
      keyboard: {
        bindings: {
          save: {
            key: 83,
            shortKey: true,
            handler: () => {
              save();
              return false;
            },
          },
          gCal: {
            key: 190,
            shortKey: true,
            handler: () => {
              if (selRef.current) {
                window.open(genCalLink(selRef.current), "_blank");
                return false;
              }
            },
          },
        },
      },
    };
  }, []);

  function showOptions(range: any, source: any, editor: any) {
    if (range?.length > 0) {
      const selection = editor.getText().slice(range.index, range.length);
      selRef.current = selection;
    }
  }

  return (
    <>
      <ReactQuill
        theme="bubble"
        value={value}
        onChange={setValue}
        onChangeSelection={showOptions}
        placeholder="Say something..."
        scrollingContainer={"#scrolling-container"}
        onKeyUp={handleKeyPress}
        modules={modules}
      />
    </>
  );
}
