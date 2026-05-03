import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PiggyBank,
  WalletCards,
  ChartNoAxesCombined,
  Menu,
  User,
  Receipt,
  ClipboardClock,
  ReceiptText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ipontayologo.png";

export default function Sidebar({ onNavigate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { name: "Dashboard", path: "/app", icon: LayoutDashboard },
    { name: "Saving Plans", path: "/app/plans", icon: PiggyBank },
    { name: "Deposit", path: "/app/deposit", icon: WalletCards },
    { name: "Analytics", path: "/app/analytics", icon: ChartNoAxesCombined },
    { name: "Deposit History", path: "/app/history", icon: ReceiptText},
    { name: "Profile", path: "/app/profile", icon: User },
  ];

  return (
    <aside className="h-full w-full bg-[#181918] p-6 md:w-64 md:border-r md:border-white/10 flex flex-col">
      <div className="mb-10 flex items-center gap-3">
        <img
          src={logo}
          alt="iponTayo logo"
          className="h-12 w-12 rounded-xl object-cover"
        />

        <h1 className="text-xl font-bold">
          <span className="text-[#21B37A]">ipon</span>Tayo
        </h1>
      </div>

      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">
        Main Menu
      </p>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/app"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#DFF5ED] text-[#075C45]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}