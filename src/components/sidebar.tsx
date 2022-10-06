import { ReactElement } from "react";
import {
  useSession,
  // signOut
} from "next-auth/react";
import {
  ListBulletIcon,
  PencilIcon,
  // UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

type SideIconProps = {
  icon: ReactElement;
  text: string;
  onClick?: () => void;
};

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <aside
      className="fixed top-0 left-0 h-screen
      p-5 z-10
      flex flex-col"
    >
      <div>
        <SideIcon
          icon={<PencilIcon />}
          onClick={() => router.push("/")}
          text="New entry..."
        />
        {session && (
          <SideIcon
            icon={<ListBulletIcon />}
            onClick={() => router.push("/entries")}
            text="My entries"
          />
        )}
        {/* <LoginBtn /> */}
      </div>
    </aside>
  );
}

function SideIcon({ icon, text = "tooltip", onClick }: SideIconProps) {
  return (
    <button
      className="relative flex items-center justify-center
      h-12 w-12 my-2 mx-auto p-2 primary-color btn-vibe group hover:shadow-lg"
      onClick={onClick}
    >
      {icon}
      <span
        className="fixed w-auto p-2 m-2 min-w-max left-14
        text-xs primary-color bg-red-800 dark:bg-blue-800 brightness-100 border-2
        transition-all duration-100 scale-0 origin-left group-hover:scale-100"
      >
        {text}
      </span>
    </button>
  );
}

// function LoginBtn() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   if (session) {
//     return (
//       <SideIcon
//         icon={<UserIcon />}
//         text={`Signed in as ${session.user?.email}`}
//         onClick={() => signOut({ callbackUrl: "/" })}
//       />
//     );
//   }
//   return (
//     <SideIcon
//       onClick={() => router.push("/login")}
//       icon={<UserIcon />}
//       text="Sign in"
//     />
//   );
// }
