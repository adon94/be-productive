import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "./button";

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    return (
      <p className="text-white text-center">
        Signed in as {session.user?.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </p>
    );
  }
  return (
    <p className="text-black text-center">
      Not signed in <br />
      <Link href="/login">
        <Button>Sign in</Button>
      </Link>
    </p>
  );
}
