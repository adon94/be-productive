import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Layout from "../components/layout";

type EntryItemProps = {
  entry: { content: string; id: string };
};

function EntryItem({ entry }: EntryItemProps) {
  const router = useRouter();
  function openJournal() {
    router.push({
      pathname: "/write",
      query: { eid: entry.id },
    });
  }
  return (
    <div
      className="border-2 border-white h-72 overflow-hidden p-2 font-indie-flower cursor-pointer
        transition-all duration-100 bg-paper dark:bg-black hover:bg-soft"
      onClick={openJournal}
    >
      <div dangerouslySetInnerHTML={{ __html: entry.content }} />
    </div>
  );
}

const Entries: NextPage = () => {
  const journalEntries = trpc.useQuery(["journal-entry.journal-entries"]);
  return (
    <Layout>
      <div
        className="container grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-2
          mx-20 min-h-screen p-5 m-2 transition-all duration-300"
      >
        {journalEntries.data?.map((entry) => (
          <EntryItem entry={entry} key={entry.id} />
        ))}
      </div>
    </Layout>
  );
};

export default Entries;
