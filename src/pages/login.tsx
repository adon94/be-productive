import Link from "next/link";
import Button from "../components/button";

export default function Login() {
  return (
    <div className="flex w-full h-full items-center justify-center bg-amber-100 noisy font-mono">
      <div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
        <p className="text-3xl text-center">Welcome.</p>
        <form className="flex flex-col pt-3 md:pt-8">
          <div className="flex flex-col pt-4">
            <div className="flex relative ">
              <input
                type="email"
                className="text-input"
                placeholder="Email..."
              />
            </div>
          </div>
          <div className="flex flex-col pt-4 mb-12">
            <div className="flex relative ">
              <input
                type="password"
                className="text-input"
                placeholder="Password..."
              />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
        <div className="pt-12 pb-12 text-center">
          <p>
            Don&#x27;t have an account?&nbsp;
            <Link href="/register">
              <span className="font-semibold underline cursor-pointer">
                Register here.
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
