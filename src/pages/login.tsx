import { signIn } from "next-auth/react";
import Button from "../components/button";
import { FormEventHandler, useState } from "react";
import Layout from "../components/layout";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
  });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", {
      email: user.email,
      // redirect: false,
      callbackUrl: "/write",
      // can I add a loading spin or something
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center">
          <p className="text-3xl text-center font-mono">Sending...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center px-8 pt-8 w-1/2 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
        <p className="text-3xl text-center font-mono">Welcome.</p>
        <form onSubmit={handleSubmit} className="flex flex-col pt-3 md:pt-8">
          <div className="flex flex-col pt-4 mb-8">
            <input
              type="email"
              className="text-input bg-transparent text-lg p-2 font-indie-flower"
              placeholder="Email..."
              value={user.email}
              autoFocus
              onChange={({ target }) =>
                setUser({ ...user, email: target.value })
              }
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
        <div className="pt-12 pb-12 text-center font-mono">
          <p>A magic sign-in link will be sent to your inbox.</p>
        </div>
      </div>
    </Layout>
  );
}
