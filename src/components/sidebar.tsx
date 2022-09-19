import { ReactElement } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  ListBulletIcon,
  PencilIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

type SideIconProps = {
  icon: ReactElement;
  text: string;
  onClick?: () => void;
};

export default function Sidebar() {
  const router = useRouter();
  return (
    <div
      className="h-screen
      p-5
      flex flex-col
    text-white"
    >
      <SideIcon
        icon={<PencilIcon />}
        onClick={() => router.push("/write")}
        text="New entry..."
      />
      <SideIcon
        icon={<ListBulletIcon />}
        onClick={() => router.push("/entries")}
        text="My entries"
      />
      <LoginBtn />
    </div>
  );
}

function SideIcon({ icon, text = "tooltip", onClick }: SideIconProps) {
  return (
    <button className="sidebar-icon bg-soft group" onClick={onClick}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </button>
  );
}

function LoginBtn() {
  const { data: session } = useSession();
  const router = useRouter();
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
    <SideIcon
      onClick={() => router.push("/login")}
      icon={<UserIcon />}
      text="Sign in"
    />
  );
}
