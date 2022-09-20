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
  let res;

  if (eid) {
    res = trpc.useQuery(
      ["journal-entry.single-journal-entry", { journalEntryId: eid }],
      {
        onSuccess: () => {
          if (bottom && bottom.current) {
            console.log("scroll into view");
            bottom.current.scrollIntoView({ behavior: "smooth" });
          }
        },
      }
    );
  }
  function handleKeyPress(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === "Enter") {
      window.scrollBy(0, 34.078);
    }
  }
  return (
    <>
      <Layout>
        <div className="flex flex-col justify-center">
          <Journal jData={res?.data} handleKeyPress={handleKeyPress} />
          <div ref={bottom} className="h-half-screen mx-auto" />
        </div>
      </Layout>
    </>
  );
};

export default Write;
