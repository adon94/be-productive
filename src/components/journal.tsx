import { CogIcon } from "@heroicons/react/24/outline";
import router from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import JournalEditor from "./journal-editor";

type JournalProps = {
  jData?: {
    content: string;
    id: string;
  } | null;
};

export default function Journal({ jData }: JournalProps) {
  const [value, setValue] = useState("");
  const [lastValue, setLastValue] = useState("");
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
      if (jData) {
        mutate({ content: value, id: jData.id });
      } else {
        mutate({ content: value });
      }
    }
    const timer = setTimeout(() => {
      if (lastValue != value) {
        // updateContent({ variables: { content: text, id: chapterId } });
        console.log("updating db...");
        addEntry();
        setLastValue(value);
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearTimeout(timer);
  }, [jData, lastValue, mutate, value]);

  return (
    <div className="flex flex-grow flex-col items-center py-5">
      {error && error.message}
      {/* {isLoading && <p>Saving...</p>} */}
      <div className="h-4">
        {isLoading && (
          <CogIcon className="animate-spin text-gray-500 dark:text-gray-400 w-4 h-4" />
        )}
      </div>
      <div className="flex flex-1 mb-8 w-2/3">
        <JournalEditor value={value} setValue={setValue} />
      </div>
    </div>
  );
}
