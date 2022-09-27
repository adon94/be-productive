import { CogIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import JournalEditor from "./journal-editor";

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
  const editorRef = useRef<any | null>(null);
  const [value, setValue] = useState("");
  const [lastValue, setLastValue] = useState("");
  const [spellcheck, setSpellcheck] = useState(true);
  const [localStorage, setLocalStorage] = useState(true);
  const [saved, setSaved] = useState(false);
  const { data: session } = useSession();
  const { mutate, error, isLoading } = trpc.useMutation(
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
    if (!session && value === "") {
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
  }, [session, value, scrollToBottom]);

  const AUTOSAVE_INTERVAL = 2000;
  useEffect(() => {
    function addEntry() {
      if (session) {
        if (jData) {
          mutate({ content: value, id: jData.id });
        }
      } else if (localStorage) {
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
  }, [jData, lastValue, mutate, value]);

  function onEditorChange(content: string, arg0: any, arg1: any, editor: any) {
    if (window && spellcheck) {
      editorRef.current = editor;
      const editorEl = window.document.querySelector(".ql-editor");
      editorEl?.setAttribute("spellcheck", "false");
      setSpellcheck(false);
    }
    setValue(content);
    saved && setSaved(false);
  }

  function getContents() {
    if (editorRef.current) {
      return editorRef.current.getHTML();
    }
    return null;
  }

  function saveDoc() {
    if (session && !jData && editorRef?.current) {
      const content = getContents();
      if (content) {
        mutate({ content });
      }
    } else if (editorRef?.current) {
      const content = getContents();
      if (content) {
        window.localStorage.setItem("content", content);
        setSaved(true);
      }
    }
  }

  function toggleMind() {
    const editorEl = window.document.querySelector(".ql-editor");
    if (editorEl?.classList.contains("hidden-mind")) {
      editorEl.classList.remove("hidden-mind");
      scrollToBottom();
    } else {
      editorEl?.classList.add("hidden-mind");
    }
  }

  return (
    <div className="flex flex-grow flex-col pt-5 w-full">
      {error && error.message}
      <div className="fixed right-16 top-5 h-4">
        {!saved && (
          <div className="h-10 w-10 flex justify-center items-center fill-gray-400 dark:fill-gray-100">
            <svg height="16" width="16">
              <circle cx="8" cy="8" r="8" fill="inheirit" />
            </svg>
          </div>
        )}
      </div>
      <div className="fixed right-5 bottom-5 h-4">
        <p className="text-gray-700 dark:text-gray-400 text-sm">⌘ + .</p>
        {isLoading && (
          <CogIcon className="animate-spin text-gray-700 dark:text-gray-400 w-5 h-5" />
        )}
      </div>
      <div className="flex flex-1 w-full">
        <JournalEditor
          value={value}
          setValue={onEditorChange}
          handleKeyPress={handleKeyPress}
          save={saveDoc}
          toggleMind={toggleMind}
        />
      </div>
    </div>
  );
}
