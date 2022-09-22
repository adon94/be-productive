import { CogIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { trpc } from "../utils/trpc";
import JournalEditor from "./journal-editor";

type JournalProps = {
  jData?: {
    content: string;
    id: string;
  } | null;
  handleKeyPress?: (arg0: KeyboardEvent) => void;
};

export default function Journal({ jData, handleKeyPress }: JournalProps) {
  const editorRef = useRef<any | null>(null);
  const [value, setValue] = useState("");
  const [lastValue, setLastValue] = useState("");
  const [spellcheck, setSpellcheck] = useState(true);
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

  const AUTOSAVE_INTERVAL = 2000;
  useEffect(() => {
    function addEntry() {
      if (session) {
        if (jData) {
          mutate({ content: value, id: jData.id });
        }
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
  }

  function createNew() {
    if (session && !jData && editorRef?.current) {
      const editor = editorRef.current.getEditor();
      const content = editor.getHTML();
      if (content) {
        mutate({ content });
      }
    }
  }

  return (
    <div className="flex flex-grow flex-col pt-5 w-full">
      {error && error.message}
      <div className="fixed right-5 bottom-5 h-4">
        {isLoading && (
          <CogIcon className="animate-spin text-gray-700 dark:text-gray-400 w-5 h-5" />
        )}
      </div>
      <div className="flex flex-1 w-full">
        <JournalEditor
          value={value}
          setValue={onEditorChange}
          handleKeyPress={handleKeyPress}
          save={createNew}
        />
      </div>
    </div>
  );
}
