import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
// import ShortMenu from "./shortMenu";
// import { useHotkeys } from "react-hotkeys-hook";
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    // eslint-disable-next-line react/display-name
    return function ForwardRef({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
  }
);

const placeholder = `The philosophy behind mind-drop is to help people translate the contents of the mind into real world action.



Because the contents of the mind hold so much personal value, mind-drop will always prioritize privacy.



That's why all data is stored locally on your machine, accessible only by you.



I hope to add encrypted server based storage in future so that your written thoughts can be accessible across different devices using a secret key.`;

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
  toggleMind?: () => void;
};

export default function JournalEditor({
  value,
  setValue,
  handleKeyPress,
  save,
}: // toggleMind,
JournalEditorProps) {
  const quillRef = useRef(null);
  const { setTheme } = useTheme();
  // const [showMenu, setShowMenu] = useState(false);
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
          // shortMenu: {
          //   key: 190,
          //   shortKey: true,
          //   handler: () => {
          //     setShowMenu(true);
          //   },
          // },
          // actionMode: {
          //   key: 72,
          //   shortKey: true,
          //   handler: () => {
          //     toggleMind();
          //   },
          // },
          // esc: {
          //   key: 27,
          //   handler: () => {
          //     setShowMenu(false);
          //   },
          // },
        },
      },
    };
  }, []);

  function markHighlighted(range: any, source: any, editor: any) {
    if (range?.length > 0) {
      const selection = editor
        .getText()
        .slice(range.index, range.index + range.length);
      selRef.current = selection;
    }
  }

  useEffect(() => {
    const init = (quill: any) => {
      console.log(quill);
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

  return (
    <ReactQuill
      theme="bubble"
      value={value}
      onChange={setValue}
      onChangeSelection={markHighlighted}
      placeholder={placeholder}
      scrollingContainer={"#scrolling-container"}
      onKeyUp={handleKeyPress}
      modules={modules}
      forwardedRef={quillRef}
    />
  );
}
