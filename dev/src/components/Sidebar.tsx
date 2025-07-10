import { useState } from "react";
import { Menu, X, ListFilter } from "lucide-react";
import React from "react";

type SidebarProps = {
  children: React.ReactNode;
  position?: "left" | "right";
  filter?: boolean;
};

export default function Sidebar({ children, position = "left", filter = false }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const isLeft = position === "left";
  const sidebarPositionClass = isLeft ? "left-0" : "right-0";
  const buttonPositionClass = isLeft ? "left-4" : "right-4";
  const translateOpen = "translate-x-0";
  const translateClosed = isLeft ? "-translate-x-full" : "translate-x-full";

  const imgButton = () => {
    if (filter) {
      return <ListFilter size={24} className="text-white" />;
    } else {
      return <Menu size={24} className="text-white" />;
    }
  }

  return (
    <>
      <button
        className={`fixed top-4 ${buttonPositionClass} z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none`}
        onClick={() => setOpen(o => !o)}
      >
        {open ? <X size={24} /> : imgButton()}
      </button>

      <aside
        className={`fixed top-0 ${sidebarPositionClass} h-full w-64 bg-gray-800 text-white px-4 py-18 z-40 transform transition-transform duration-300 overflow-scroll ${open ? translateOpen : translateClosed
          }`}
      >
        <div className="flex flex-col gap-4">{children}</div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
