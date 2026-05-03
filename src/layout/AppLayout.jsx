import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useAuth();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const themeClass =
    theme === "dark"
      ? "bg-[#1C1C1C] text-white"
      : "bg-[#F8F5F0] text-black";

  return (
    <div className="min-h-screen w-full bg-[#151515] text-white">
      {/* Mobile top bar */}
      <div className="flex items-center bg-[#181918] px-4 py-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-xl bg-white/10 p-2"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] w-full md:min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-[64px] z-50 h-[calc(100vh-64px)] w-72 bg-[#181918] transition-transform duration-300 md:static md:h-auto md:w-64 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        {/* Dark overlay on mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-[64px] z-40 bg-black/50 md:hidden"
          />
        )}

        <main className={`min-w-0 flex-1 p-4 md:p-8 ${themeClass}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}