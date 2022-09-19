import type { NextPage } from "next";
import { useRouter } from "next/router";
import Journal from "../components/journal";
import { trpc } from "../utils/trpc";
import Layout from "../components/layout";

type routerParams = {
  eid?: string;
};

const Write: NextPage = () => {
  const router = useRouter();
  const { eid }: routerParams = router.query;
  let res;

  if (eid) {
    res = trpc.useQuery([
      "journal-entry.single-journal-entry",
      { journalEntryId: eid },
    ]);
  }
  return (
    <Layout>
      <Journal jData={res?.data} />
    </Layout>
  );
};

export default Write;
