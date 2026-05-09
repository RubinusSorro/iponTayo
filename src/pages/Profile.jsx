import { useState } from "react";
import { UserRound, Bell, Palette, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { plans } = useApp();
  const { user, logout, forgotPassword, theme, changeTheme, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);

  const isDark = theme === "dark";

  const cardClass = isDark
    ? "bg-[#252525] text-white border-white/10"
    : "bg-white text-[#1C1C1C] border-black/10";

  const mutedText = isDark ? "text-gray-300" : "text-gray-500";
  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";

  const getMemberSinceDate = () => {
    if (!user?.metadata?.creationTime) return "";
    const date = new Date(user.metadata.creationTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const totalSaved = plans.reduce(
    (sum, plan) => sum + plan.savedAmount,
    0
  );

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const fallbackName =
    user?.displayName || user?.email?.split("@")[0] || "iponTayo user";

  const nameToShow = fullName || fallbackName;
    
    return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${mainText}`}>Profile</h1>
        <p className={`text-sm ${mutedText}`}>
          Manage your account and app preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Profile Card */}
        <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DFF5ED] text-[#075C45]">
              <UserRound size={42} />
            </div>

            <h2 className={`mt-4 text-2xl font-bold ${mainText}`}>
              {nameToShow}
            </h2>

            <p className={`text-sm ${mutedText}`}>
              {user?.email}
            </p>

            <p className={`mt-5 text-sm ${mutedText}`}>
              Member since {getMemberSinceDate()}
            </p>
          </div>

            <div className={`mt-8 space-y-4 border-t pt-5 ${isDark ? "border-white/10" : "border-black/10"}`}>
              <div className="flex justify-between text-sm">
                <span className={mutedText}>Currency</span>
                <span className={`font-semibold ${mainText}`}>PHP ₱</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className={mutedText}>Active plans</span>
              <span className={`font-semibold ${mainText}`}>{plans.length}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className={mutedText}>Total saved</span>
              <span className="font-semibold text-[#159A6A]">
                ₱{totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="relative">
            <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
              <div className="mb-5 flex items-center gap-3">
                <Bell className="text-[#21B37A]" />
                <div>
                  <h2 className={`text-lg font-bold ${mainText}`}>
                    Notifications
                  </h2>
                  <p className={`text-sm ${mutedText}`}>
                    Control your savings reminders.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <SettingRow title="Monthly reminder" active />
                <SettingRow title="Goal progress alerts" active />
                <SettingRow title="Slow progress warning" />
              </div>
            </div>

            <div className={`absolute inset-0 rounded-2xl backdrop-blur-sm flex items-center justify-center ${
              isDark 
                ? "bg-black/40" 
                : "bg-white/40"
            }`}>
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-2 ${mainText}`}>
                  Coming soon
                </h3>
                <p className={`text-sm ${mutedText}`}>
                  Notifications are currently under development.
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-center gap-3">
              <Palette className="text-[#F0A429]" />
              <div>
                <h2 className={`text-lg font-bold ${mainText}`}>
                  Appearance
                </h2>
                <p className={`text-sm ${mutedText}`}>
                  Customize your dashboard style.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ThemeBox
                name="Ivory"
                color="#F8F5F0"
                active={theme === "ivory"}
                onClick={() => changeTheme("ivory")}
              />
              <ThemeBox
                name="Dark"
                color="#1C1C1C"
                active={theme === "dark"}
                onClick={() => changeTheme("dark")}
              />
            </div>
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="text-[#3B82F6]" />
              <div>
                <h2 className={`text-lg font-bold ${mainText}`}>
                  Security
                </h2>
                <p className={`text-sm ${mutedText}`}>
                  Your account security and login settings.
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                try {
                  await forgotPassword(user.email);
                  toast.success("Password reset email sent!");
                } catch {
                  toast.error("Failed to send reset email.");
                }
              }}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-black/20 text-[#1C1C1C] hover:bg-black/5"
              }`}
            >
              Send password reset email
            </button>

            {showChangePassword && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowChangePassword(false);
                }}
                className="mt-5 space-y-4"
              >
                <p className="text-sm text-gray-500">
                  Check your email for the password reset link.
                </p>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#21B37A] py-3 text-sm font-bold text-white"
                >
                  Done
                </button>
              </form>
            )}

            <button
              onClick={() => {
                toast((t) => (
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Delete your account?</p>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone.
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await deleteAccount();
                            toast.dismiss(t.id);
                            toast.success("Account deleted.");
                            navigate("/signup");
                          } catch (error) {
                            toast.dismiss(t.id);
                            toast.error("Please log in again before deleting your account.");
                          }
                        }}
                        className="rounded-md bg-red-500 px-3 py-1 font-semibold text-white hover:bg-red-600"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="rounded-md border px-3 py-1 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ));
              }}
              className="mt-6 w-full rounded-xl border border-red-300 py-3 font-semibold text-red-500 hover:bg-red-50"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ title, active }) {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";
  
  return (
    <div className="flex items-center justify-between">
      <p className={`text-sm font-semibold ${mainText}`}>{title}</p>

      <div
        className={`flex h-6 w-11 items-center rounded-full p-1 ${
          active ? "justify-end bg-[#21B37A]" : "justify-start bg-gray-300"
        }`}
      >
        <div className="h-4 w-4 rounded-full bg-white"></div>
      </div>
    </div>
  );
}

function ThemeBox({ name, color, active, onClick }) {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const borderClass = isDark ? "border-white/20" : "border-black/10";
  const textClass = isDark ? "text-white" : "text-[#1C1C1C]";
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 ${
        active ? "border-[#21B37A]" : borderClass
      }`}
    >
      <div
        className={`mb-2 h-12 rounded-lg border ${borderClass}`}
        style={{ backgroundColor: color }}
      ></div>
      <p className={`text-center text-xs font-bold ${textClass}`}>{name}</p>
    </button>
  );
}