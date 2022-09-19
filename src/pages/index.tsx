import type { NextPage } from "next";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";

const Home: NextPage = () => {
  return (
    <Layout>
      <Sidebar />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        Hello there!
      </div>
    </Layout>
  );
};

export default Home;
