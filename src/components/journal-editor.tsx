import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Hotkeys from "./hotkeys";
import { useHotkeys } from "react-hotkeys-hook";
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
  toggleMind: () => void;
};

export default function JournalEditor({
  value,
  setValue,
  handleKeyPress,
  save,
  toggleMind,
}: JournalEditorProps) {
  const { setTheme } = useTheme();
  const [showHotkeys, setShowHotkeys] = useState(false);
  useHotkeys("esc", () => esc());
  useHotkeys("cmd+h", () => setShowHotkeys(true));
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
            key: 71,
            shortKey: true,
            handler: () => {
              if (selRef.current) {
                window.open(genCalLink(selRef.current), "_blank");
                return false;
              }
            },
          },
          darkmode: {
            key: 68,
            shortKey: true,
            handler: () => {
              const theme = localStorage.getItem("theme");
              setTheme(theme === "dark" ? "light" : "dark");
              return false;
            },
          },
          hot: {
            key: 72,
            shortKey: true,
            handler: () => {
              setShowHotkeys(true);
            },
          },
          actionMode: {
            key: 190,
            shortKey: true,
            handler: () => {
              toggleMind();
            },
          },
          esc: {
            key: 27,
            handler: () => {
              setShowHotkeys(false);
            },
          },
        },
      },
    };
  }, []);

  function showOptions(range: any, source: any, editor: any) {
    if (range?.length > 0) {
      const selection = editor
        .getText()
        .slice(range.index, range.index + range.length);
      selRef.current = selection;
    }
  }

  function esc() {
    setShowHotkeys(false);
  }

  useEffect(() => {
    if (window) {
      if (!window.localStorage.getItem("content")) {
        setShowHotkeys(true);
      }
    }
  }, []);

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
      <Hotkeys visible={showHotkeys} />
    </>
  );
}
