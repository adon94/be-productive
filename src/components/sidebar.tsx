import { ReactElement } from "react";
import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";

type SideIconProps = {
  icon: ReactElement;
  text: string;
};

export default function Sidebar() {
  return (
    <div
      className="fixed top-2 left-2 h-screen w-16
      flex flex-col
    text-black"
    >
      <SideIcon icon={<PencilIcon />} text="Journal" />
      <SideIcon icon={<UserIcon />} text="Sign in" />
    </div>
  );
}

function SideIcon({ icon, text = "tooltip" }: SideIconProps) {
  return (
    <div className="sidebar-icon vibey border-2 border-white group">
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
}
