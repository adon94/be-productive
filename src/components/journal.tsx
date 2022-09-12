import { useState } from "react";
import { trpc } from "../utils/trpc";
import Button from "./button";
import JournalEditor from "./journal-editor";

export default function Journal() {
  const [value, setValue] = useState("");
  const { mutate, error } = trpc.useMutation(
    ["journal-entry.create-journal-entry"],
    {
      onSuccess: (response) => {
        window.alert("Posted!");
        console.log({ response });
      },
    }
  );
  function addEntry() {
    mutate({ content: value });
  }
  return (
    <div className="w-full h-full my-8 px-14">
      {error && error.message}
      <JournalEditor value={value} setValue={setValue} />
      <Button onClick={addEntry}>Send to db</Button>
    </div>
  );
}
