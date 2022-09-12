import Link from "next/link";
import { signIn } from "next-auth/react";
import Button from "../components/button";
import { FormEventHandler, useState } from "react";

export default function Register() {
  const [user, setUser] = useState({
    email: "",
  });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // validate your userinfo
    e.preventDefault();

    const res = await signIn("email", {
      email: user.email,
      // redirect: false,
      callbackUrl: "http://localhost:3000/",
    });

    console.log(res);
  };
  return (
    <div className="flex w-full h-full items-center justify-center bg-amber-100 noisy font-mono">
      <div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
        <p className="text-3xl text-center">Welcome.</p>
        <form onSubmit={handleSubmit} className="flex flex-col pt-3 md:pt-8">
          <div className="flex flex-col pt-4 mb-8">
            <div className="flex relative ">
              <input
                type="email"
                className="text-input"
                placeholder="Email..."
                value={user.email}
                onChange={({ target }) =>
                  setUser({ ...user, email: target.value })
                }
              />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
        <div className="pt-12 pb-12 text-center">
          <p>
            Already have an account?&nbsp;
            <Link href="/login">
              <span className="font-semibold underline cursor-pointer">
                Log in here.
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
