// import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
import ReactQuill, { Range } from "react-quill";
import ShortMenu from "./shortMenu";

const placeholder = `The philosophy behind mind-drop is to help people translate the contents of the mind into real world action.

Because the contents of the mind hold so much personal value, mind-drop will always prioritize privacy.

That's why all saved data is stored locally on your browser, accessible only by you.

To begin, just start writing.`;

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
  setValue: (
    value: string,
    delta: unknown,
    source: unknown,
    editor: ReactQuill.UnprivilegedEditor
  ) => void;
  handleKeyPress?: (arg0: KeyboardEvent) => void;
  save: () => void;
  toggleMind?: () => void;
  scrollToBottom: () => void;
};

export default function JournalEditor({
  value,
  setValue,
  handleKeyPress,
  save,
  scrollToBottom,
}: // toggleMind,
JournalEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const { setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [filtered, setFiltered] = useState<string | null>(null);
  const selRef = useRef<string | null>(null);
  useHotkeys("command+.", () => {
    if (showMenu) closeMenu();
    else setShowMenu(true);
  });
  useHotkeys("escape", () => {
    setShowMenu(false);
    closeMenu();
  });
  useHotkeys("command+d", (e) => {
    e.preventDefault();
    const theme = localStorage.getItem("theme");
    setTheme(theme === "dark" ? "light" : "dark");
  });
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
          todo: {
            key: 32,
            collapsed: true,
            format: { todo: false },
            prefix: /^>$/,
            offset: 1,
            handler: (range: Range) => {
              insertTodo(range);
            },
          },
          shortMenu: {
            key: 190,
            shortKey: true,
            handler: () => {
              setShowMenu(true);
            },
          },
        },
      },
    };
  }, [setTheme, save]);

  function markHighlighted(
    range: Range,
    source: unknown,
    editor: { getText: () => string }
  ) {
    if (range && range.length > 0) {
      const selection = editor
        .getText()
        .slice(range.index, range.index + range.length);
      selRef.current = selection;
    }
  }

  useEffect(() => {
    const init = async (quill: ReactQuill) => {
      quill.focus();
      if (quill?.editor) {
        const lastIndex = quill.editor.getText().length;
        quill.editor.setSelection({ index: lastIndex, length: 0 });
      }
    };
    const check = () => {
      if (quillRef.current) {
        init(quillRef.current);
        return;
      }
      setTimeout(check, 200);
    };
    check();
  }, [quillRef]);

  useEffect(() => {
    if (filtered === null) {
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }, [filtered, scrollToBottom]);

  function formatAsTodo(range: Range) {
    if (range) {
      const ed = quillRef?.current?.getEditor();
      console.log("formatting");
      ed?.formatLine(range.index, 1, { list: "unchecked" });
    }
  }

  function insertTodo(range: Range) {
    // if (!range) range = quillRef?.current?.getSelection();
    if (range) {
      const ed = quillRef?.current?.getEditor();
      ed?.deleteText(range.index - 1, 1);
      ed?.formatLine(range.index - 1, 1, { list: "unchecked" });
    }
  }

  function closeMenu() {
    setShowMenu(false);
    quillRef?.current?.focus();
  }
  console.log(showMenu);
  return (
    <>
      <ReactQuill
        theme="bubble"
        value={value}
        onChange={setValue}
        onChangeSelection={markHighlighted}
        placeholder={placeholder}
        scrollingContainer={"#scrolling-container"}
        onKeyUp={handleKeyPress}
        modules={modules}
        ref={quillRef}
      />
      {showMenu && (
        <ShortMenu
          filtered={filtered}
          setFiltered={setFiltered}
          visible={showMenu}
          close={closeMenu}
          addToDo={formatAsTodo}
        />
      )}
    </>
  );
}
