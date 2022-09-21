import { CogIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect, useState } from "react";
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
        } else {
          mutate({ content: value });
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

  function onEditorChange(content: string) {
    if (window && spellcheck) {
      const editor = window.document.querySelector(".ql-editor");
      editor?.setAttribute("spellcheck", "false");
      setSpellcheck(false);
    }
    setValue(content);
  }

  return (
    <div className="flex flex-grow flex-col pt-5 w-2/3">
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
        />
      </div>
    </div>
  );
}
