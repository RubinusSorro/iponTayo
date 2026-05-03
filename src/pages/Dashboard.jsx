import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { plans, contributions, appLoading } = useApp();
  const { theme } = useAuth();

  if (appLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-40 animate-pulse rounded bg-gray-300/40"></div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-gray-300/40"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-xl bg-gray-300/40"></div>
      </div>
    );
  }

  if (!appLoading && plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-bold text-[#1C1C1C]">
          No savings yet
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Start by creating your first saving plan.
        </p>
      </div>
    );
  }

  const isDark = theme === "dark";

  const cardClass = isDark
    ? "bg-[#252525] text-white border-white/10"
    : "bg-white text-[#1C1C1C] border-black/5";

  const mutedText = isDark ? "text-gray-300" : "text-gray-500";
  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";

  const totalSavings = plans.reduce((sum, plan) => sum + plan.savedAmount, 0);

  const activePlans = plans.length;

  const recentContributions = contributions.slice(0, 3);

  

  const today = new Date();

   const formattedDate = `${today.getMonth() + 1}-${String(
   today.getDate()
   ).padStart(2, "0")}-${today.getFullYear()}`;

   
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${mainText}`}>Dashboard</h1>
          <p className={`text-sm ${mutedText}`}>{formattedDate}</p>
        </div>

        <button
          onClick={() => navigate("/app/deposit")}
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold ${
            isDark
              ? "border-white/20 text-white hover:bg-white/10"
              : "border-black/20 text-[#1C1C1C] hover:bg-black/5"
          }`}
        >
          <Plus size={18} />
          Deposit Cash
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-2xl p-5 shadow-sm border ${cardClass}`}>
          <p className={`text-sm font-semibold ${mutedText}`}>Total savings</p>
          <h2 className={`mt-2 text-3xl font-bold ${
            isDark ? "text-[#5DDCC7]" : "text-[#159A6A]"
          }`}>
            ₱{totalSavings.toLocaleString()}
          </h2>
          <p className={`text-xs ${mutedText}`}>across all plans</p>
        </div>

        <div className={`rounded-2xl p-5 shadow-sm border ${cardClass}`}>
          <p className={`text-sm font-semibold ${mutedText}`}>This month</p>
          <h2 className={`mt-2 text-3xl font-bold ${mainText}`}>
            ₱
            {contributions
              .reduce((sum, item) => sum + item.amount, 0)
              .toLocaleString()}
          </h2>
          <p className={`text-xs ${mutedText}`}>total deposits</p>
        </div>

        <div className={`rounded-2xl p-5 shadow-sm border ${cardClass}`}>
          <p className={`text-sm font-semibold ${mutedText}`}>Active plans</p>
          <h2 className={`mt-2 text-3xl font-bold ${
            isDark ? "text-[#F0A429]" : "text-[#F0A429]"
          }`}>
            {activePlans}
          </h2>
          <p className={`text-xs ${mutedText}`}>saving goals</p>
        </div>
      </div>

      <div>
        <h2 className={`mb-3 text-lg font-bold ${mainText}`}>Saving plans</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {plans.slice(0, 2).map((plan) => {
            const percent = Math.min(
              Math.round((plan.savedAmount / plan.goalAmount) * 100),
              100
            );

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 shadow-sm border ${cardClass}`}
              >
                <div className="flex justify-between">
                  <h3 className={`font-bold ${mainText}`}>{plan.title}</h3>
                  <span className="rounded-full bg-[#DFF5ED] px-3 py-1 text-xs font-bold text-[#075C45]">
                    {plan.status}
                  </span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[#21B37A]"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <p className={`font-semibold ${mainText}`}>
                    ₱{plan.savedAmount.toLocaleString()} saved
                  </p>
                  <p className={mutedText}>
                    Goal: ₱{plan.goalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={`rounded-2xl p-5 shadow-sm border ${cardClass}`}>
          <h3 className={`mb-4 font-bold ${mainText}`}>Monthly savings</h3>

          <div className="flex h-40 items-end gap-3">
            {[40, 55, 45, 70, 60, 85].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-[#9ADBC6]"
                  style={{ height: `${height}%` }}
                ></div>
                <span className={`text-xs ${mutedText}`}>
                  {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-sm border ${cardClass}`}>
          <h3 className={`mb-4 font-bold ${mainText}`}>Recent deposits</h3>

          <div className="space-y-4">
            {recentContributions.length === 0 ? (
              <p className={`text-sm ${mutedText}`}>No deposits yet</p>
            ) : (
              recentContributions.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between border-b pb-3 last:border-0 ${
                    isDark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${mainText}`}>
                      {item.planTitle}
                    </p>
                    <p className={`text-xs ${mutedText}`}>{item.date}</p>
                  </div>

                  <p className={`font-bold ${
                    isDark ? "text-[#5DDCC7]" : "text-[#159A6A]"
                  }`}>
                    +₱{item.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}