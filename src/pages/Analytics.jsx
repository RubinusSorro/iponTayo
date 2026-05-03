import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Target, CalendarDays } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Analytics() {
  const { plans, contributions } = useApp();
  const { theme } = useAuth();

  const isDark = theme === "dark";

  const cardClass = isDark
    ? "bg-[#252525] text-white border-white/10"
    : "bg-white text-[#1C1C1C] border-black/10";

  const mutedText = isDark ? "text-gray-300" : "text-gray-500";
  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";

  const totalContributions = contributions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const averageSavings =
    contributions.length > 0
      ? Math.round(totalContributions / contributions.length)
      : 0;

  const bestPlan = plans.reduce((best, plan) => {
    return plan.savedAmount > best.savedAmount ? plan : best;
  }, plans[0]);

  const today = new Date();

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));

    return {
      label: d.toLocaleString("en-US", { month: "short" }),
      month: d.getMonth(),
      year: d.getFullYear(),
    };
  });

  const monthlyData = months.map((m) => {
    const savings = contributions
      .filter((item) => {
        const d = item.createdAt?.toDate
          ? item.createdAt.toDate()
          : new Date(item.createdAt);

        return d.getMonth() === m.month && d.getFullYear() === m.year;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      month: m.label,
      savings,
    };
  });

  let runningTotal = 0;

  const growthData = monthlyData.map((item) => {
    runningTotal += item.savings;

    return {
      month: item.month,
      savings: runningTotal,
    };
  });

 

  const thisMonthTotal = contributions
    .filter((item) => {
      const d = item.createdAt?.toDate
        ? item.createdAt.toDate()
        : new Date(item.createdAt);
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const averageDeposit =
    contributions.length > 0
      ? contributions.reduce((sum, item) => sum + item.amount, 0) /
        contributions.length
      : 0;

  const totalSaved = contributions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalGoal = plans.reduce(
    (sum, plan) => sum + Number(plan.goalAmount),
    0
  );

  const percentage = totalGoal > 0 ? (totalSaved / totalGoal) * 100 : 0;

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const lastMonthTotal = contributions
    .filter((item) => {
      const d = item.createdAt?.toDate
        ? item.createdAt.toDate()
        : new Date(item.createdAt);

      return (
        d.getMonth() === lastMonth.getMonth() &&
        d.getFullYear() === lastMonth.getFullYear()
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const percentChange =
    lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;

  const now = new Date();

  const thisWeekTotal = contributions
    .filter((item) => {
      const d = item.createdAt?.toDate
        ? item.createdAt.toDate()
        : new Date(item.createdAt);

      const diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const lastWeekTotal = contributions
    .filter((item) => {
      const d = item.createdAt?.toDate
        ? item.createdAt.toDate()
        : new Date(item.createdAt);

      const diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff > 7 && diff <= 14;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  let insightMessage = "";

  if (percentage < 30) {
    insightMessage = "You're just getting started. Stay consistent!";
  } else if (percentage < 70) {
    insightMessage = "Good progress! Keep the momentum.";
  } else {
    insightMessage = "You're close to your goal! Finish strong.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${mainText}`}>Analytics</h1>
        <p className={`text-sm ${mutedText}`}>
          Track your savings progress and monthly habits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-xl p-4 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <p className={`text-sm ${mutedText}`}>This month</p>
          <h2 className={`text-2xl font-bold ${mainText} mt-1`}>
            ₱{thisMonthTotal.toLocaleString()}
          </h2>
          <p className={`text-xs ${mutedText} mt-2`}>
            <span className={percentChange >= 0 ? "text-green-500" : "text-red-500"}>
              {percentChange >= 0 ? "↑" : "↓"}
            </span>{" "}
            {Math.abs(percentChange).toFixed(0)}% vs last month
          </p>
        </div>

        <div className={`rounded-xl p-4 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <p className={`text-sm ${mutedText}`}>This week</p>
          <h2 className={`text-2xl font-bold ${mainText} mt-1`}>
            ₱{thisWeekTotal.toLocaleString()}
          </h2>
          <p className={`text-xs ${mutedText} mt-2`}>
            vs ₱{lastWeekTotal.toLocaleString()} last week
          </p>
        </div>

        <div className={`rounded-xl p-4 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <p className={`text-sm ${mutedText}`}>Average deposit</p>
          <h2 className={`text-2xl font-bold ${mainText} mt-1`}>
            ₱{averageDeposit.toFixed(0)}
          </h2>
          <p className={`text-xs ${mutedText} mt-2`}>
            {contributions.length} total deposits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <Target className="text-[#F0A429]" />
          <p className={`mt-4 text-sm font-semibold ${mutedText}`}>
            Total goal
          </p>
          <h2 className={`text-3xl font-bold ${mainText}`}>
            ₱{totalGoal.toLocaleString()}
          </h2>
          <p className={`text-xs ${mutedText} mt-2`}>
            {percentage.toFixed(0)}% achieved
          </p>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <CalendarDays className="text-[#3B82F6]" />
          <p className={`mt-4 text-sm font-semibold ${mutedText}`}>
            Total deposits
          </p>
          <h2 className={`text-3xl font-bold ${mainText}`}>
            ₱{totalSaved.toLocaleString()}
          </h2>
          <p className={`text-xs ${mutedText} mt-2`}>
            {contributions.length} deposits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <h2 className={`mb-4 text-lg font-bold ${mainText}`}>
            Monthly savings trend
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="savings" fill="#21B37A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardClass}`}>
          <h2 className={`mb-4 text-lg font-bold ${mainText}`}>
            Savings growth
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#21B37A"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardClass}`}>
        <h2 className={`mb-4 text-lg font-bold ${mainText}`}>
          Savings by plan
        </h2>

        <div className="space-y-4">
          {plans.map((plan) => {
            const percent = Math.min(
              Math.round((plan.savedAmount / plan.goalAmount) * 100),
              100
            );

            return (
              <div key={plan.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className={`font-semibold ${mainText}`}>
                    {plan.title}
                  </span>
                  <span className={mutedText}>
                    ₱{plan.savedAmount.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[#21B37A]"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}