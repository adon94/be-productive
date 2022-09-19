import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import Button from "./button";
import JournalEditor from "./journal-editor";

type JournalProps = {
  data?: {
    content: string;
    id: string;
  } | null;
};

export default function Journal({ data }: JournalProps) {
  const [value, setValue] = useState("");
  const { mutate, error, isLoading } = trpc.useMutation([
    `journal-entry.${data ? "update" : "create"}-journal-entry`,
  ]);
  function addEntry() {
    if (data) {
      mutate({ content: value, id: data.id });
    } else {
      mutate({ content: value });
    }
  }
  useEffect(() => {
    if (data) {
      setValue(data.content);
    }
  }, [data]);

  return (
    <div className="flex flex-grow flex-col items-center mr-16 pr-1 pb-5">
      {error && error.message}
      {isLoading && <p>Saving...</p>}
      <div className="flex flex-1 mb-8 w-2/3">
        <JournalEditor value={value} setValue={setValue} />
      </div>
      <Button onClick={addEntry}>Save</Button>
    </div>
  );
}
