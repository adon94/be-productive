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
    <aside
      className="fixed top-0 left-0 h-screen
      p-5
      flex flex-col"
    >
      <div>
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
    </aside>
  );
}

function SideIcon({ icon, text = "tooltip", onClick }: SideIconProps) {
  return (
    <button
      className="relative flex items-center justify-center
      h-12 w-12 my-2 mx-auto p-2 bg-soft group"
      onClick={onClick}
    >
      {icon}
      <span
        className="fixed w-auto p-2 m-2 min-w-max left-14
        text-xs bg-soft brightness-100
        transition-all duration-100 scale-0 origin-left group-hover:scale-100"
      >
        {text}
      </span>
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
