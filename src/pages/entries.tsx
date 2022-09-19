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
      className="shadow-lg border-2 p-2 font-indie-flower cursor-pointer"
      onClick={openJournal}
    >
      <div dangerouslySetInnerHTML={{ __html: entry.content }} />
    </div>
  );
}

const Entries: NextPage = () => {
  const journalEntries = trpc.useQuery(["journal-entry.journal-entries"]);
  console.log({ journalEntries });

  return (
    <Layout>
      <div
        className="container grid grid-cols-1 md:grid-cols-3 gap-4 grid-rows-2
          mx-20 min-h-screen p-4"
      >
        {journalEntries.data?.map((entry) => (
          <EntryItem entry={entry} key={entry.id} />
        ))}
      </div>
    </Layout>
  );
};

export default Entries;
