// import { CogIcon } from "@heroicons/react/24/outline";
// import { useSession } from "next-auth/react";
import router from "next/router";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import ReactQuill from "react-quill";

const JournalEditor = dynamic(() => import("./journal-editor"), { ssr: false });

type JournalProps = {
  jData?: {
    content: string;
    id: string;
  } | null;
  handleKeyPress?: (arg0: KeyboardEvent) => void;
  scrollToBottom: () => void;
};

export default function Journal({
  jData,
  handleKeyPress,
  scrollToBottom,
}: JournalProps) {
  const editorRef = useRef<ReactQuill | null>(null);
  const editorHeightRef = useRef<number>(0);
  const [value, setValue] = useState("");
  const [lastValue, setLastValue] = useState("");
  const [spellcheck, setSpellcheck] = useState(true);
  const [localStorage, setLocalStorage] = useState(true);
  const [saved, setSaved] = useState(false);
  // const { data: session } = useSession();
  const { mutate, error } = trpc.useMutation(
    // isLoading
    [`journal-entry.${jData ? "update" : "create"}-journal-entry`],
    {
      onSuccess: (data) => {
        if (!jData) {
          router.replace({
            pathname: "/write",
            query: { eid: data.id },
          });
        }
      },
    }
  );

  const saveDoc = useCallback(() => {
    // if (session && !jData && editorRef?.current) {
    //   const content = getContents();
    //   if (content) {
    //     mutate({ content });
    //   }
    if (editorRef?.current) {
      const content = editorRef.current.getEditorContents();
      if (content) {
        window.localStorage.setItem("content", content as string);
        setSaved(true);
      }
    }
  }, []);

  useEffect(() => {
    if (jData) {
      setValue(jData.content);
      setLastValue(jData.content);
    } else {
      setValue("");
      setLastValue("");
    }
  }, [jData]);

  useEffect(() => {
    if (value === "") {
      const content = window.localStorage.getItem("content");
      if (content) {
        setValue(content);
        setLocalStorage(true);
        setSaved(true);
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      }
    }
  }, [value, scrollToBottom]);

  const AUTOSAVE_INTERVAL = 2000;
  useEffect(() => {
    function addEntry() {
      // if (session) {
      //   if (jData) {
      //     mutate({ content: value, id: jData.id });
      //   }
      // } else
      if (localStorage) {
        saveDoc();
      }
    }
    const timer = setTimeout(() => {
      if (lastValue != value) {
        addEntry();
        setLastValue(value);
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearTimeout(timer);
  }, [jData, lastValue, mutate, value, localStorage, saveDoc]);

  function disableSpellcheck() {
    const editorEl = window.document.querySelector(".ql-editor");
    editorEl?.setAttribute("spellcheck", "false");
    setSpellcheck(false);
  }

  function followCursor() {
    if (editorRef.current) {
      const range = editorRef.current.getEditorSelection();
      if (range) {
        const { index } = range;
        const height =
          editorRef.current?.unprivilegedEditor?.getBounds(index).top;
        if (height && height > editorHeightRef.current) {
          window.scrollBy(0, 35);
          editorHeightRef.current = height;
        } else if (!editorHeightRef.current && height) {
          editorHeightRef.current = height;
        }
      }
    }
  }

  function onEditorChange(content: string) {
    if (window && spellcheck) {
      disableSpellcheck();
    }
    followCursor();
    // const editor = editorRef?.current?.getEditor();
    // const range = editorRef?.current?.getEditorSelection();
    // if (range && editor) {
    //   // editor?.formatLine(range.index, 1, { inline: "stamp" });
    //   console.log("selected", editor.getLine(range.index)[0]);
    //   // console.log(unprivelagedEditor.getHTML());
    //   // Ok so we gonna add a 'updated' attribute to the current element
    //   // I think there was a way to get the current selection as an element...
    // }
    setValue(content);
    saved && setSaved(false);
  }

  return (
    <div className="flex flex-grow flex-col w-full">
      {error && error.message}
      <div className="fixed right-5 top-5 h-4">
        {!saved && (
          <div className="h-10 w-10 flex justify-center items-center fill-gray-300 dark:fill-gray-100">
            <svg height="16" width="16">
              <circle cx="8" cy="8" r="8" fill="inheirit" />
            </svg>
          </div>
        )}
      </div>
      <div className="fixed right-5 bottom-5 h-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">/</p>
        {/* {isLoading && (
          <CogIcon className="animate-spin text-gray-700 dark:text-gray-400 w-5 h-5" />
        )} */}
      </div>
      <div className="flex flex-1 w-full justify-center">
        <JournalEditor
          editorRef={editorRef}
          value={value}
          setValue={onEditorChange}
          handleKeyPress={handleKeyPress}
          save={saveDoc}
          scrollToBottom={scrollToBottom}
        />
      </div>
    </div>
  );
}
