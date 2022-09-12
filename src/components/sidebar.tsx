import { ReactElement } from "react";
import { useSession, signOut } from "next-auth/react";
import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type SideIconProps = {
  icon: ReactElement;
  text: string;
  onClick?: () => void;
};

export default function Sidebar() {
  return (
    <div
      className="fixed top-2 left-2 h-screen w-16
      flex flex-col
    text-black"
    >
      <SideIcon icon={<PencilIcon />} text="Journal" />
      <LoginBtn />
    </div>
  );
}

function SideIcon({ icon, text = "tooltip", onClick }: SideIconProps) {
  return (
    <button
      className="sidebar-icon vibey border-2 border-white group"
      onClick={onClick}
    >
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </button>
  );
}

function LoginBtn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <SideIcon
        icon={<UserIcon />}
        text={`Signed in as ${session?.user?.email}`}
        onClick={signOut}
      />
    );
  }
  return (
    <Link href="/login">
      <SideIcon icon={<UserIcon />} text="Sign in" />
    </Link>
  );
}
