// src/Sidebar.jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import React from "react";

export default function Sidebar({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white px-4 py-18 z-40 transform transition-transform duration-300 overflow-scroll ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
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
