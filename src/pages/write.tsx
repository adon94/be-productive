import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Journal from "../components/journal";
import { trpc } from "../utils/trpc";
import Layout from "../components/layout";
import { useRef } from "react";

type routerParams = {
  eid?: string;
};

const Write: NextPage = () => {
  const bottom = useRef<null | HTMLDivElement>(null);
  const router = useRouter();
  const { eid }: routerParams = router.query;
  const res = trpc.useQuery(
    [
      "journal-entry.single-journal-entry",
      { journalEntryId: eid || "something" },
    ],
    { enabled: Boolean(eid) }
  );
  useEffect(() => {
    scrollToBottom();
  }, [res]);

  function scrollToBottom() {
    if (bottom && bottom.current) {
      bottom.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      window.scrollBy(0, 34.078);
    }
  }
  return (
    <>
      <Layout>
        <div className="flex flex-col items-center w-full">
          <Journal
            jData={res?.data}
            handleKeyPress={handleKeyPress}
            scrollToBottom={scrollToBottom}
          />
          <div ref={bottom} className="h-28 mx-auto" />
        </div>
      </Layout>
    </>
  );
};

export default Write;
