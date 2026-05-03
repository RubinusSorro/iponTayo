import { useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { WalletCards } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Deposit() {
  const { plans, contributions, addContribution } = useApp();

  const location = useLocation();
  const selectedPlanId = location.state?.planId || "";

  const { theme } = useAuth();

  const isDark = theme === "dark";

  const cardClass = isDark
    ? "bg-[#252525] text-white border-white/10"
    : "bg-white text-[#1C1C1C] border-black/10";

  const mutedText = isDark ? "text-gray-300" : "text-gray-500";
  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";
  const inputClass = isDark
    ? "bg-[#1C1C1C] border-white/10 text-white"
    : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]";

  const [formData, setFormData] = useState({
    planId: selectedPlanId,
    amount: "",
    date: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans.find(
    (plan) => plan.id === formData.planId
  );

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-bold text-[#1C1C1C]">No plans yet</p>
        <p className="mt-2 text-sm text-gray-500">
          Create a saving plan to start depositing.
        </p>
      </div>
    );
  }

  const recentDeposit = contributions[0];

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.planId || !formData.amount || !formData.date) {
      toast.error("Please complete the plan, amount, and date.");
      return;
    }

    const amount = Number(formData.amount);

    if (!selectedPlan) {
      toast.error("Please select a valid plan.");
      return;
    }

    const remaining = selectedPlan.goalAmount - selectedPlan.savedAmount;

    if (amount <= 0) {
      toast.error("Amount must be greater than ₱0.");
      return;
    }

    if (amount > remaining) {
      toast.error(
        `Invalid amount. You only need ₱${remaining.toLocaleString()} more.`
      );
      return;
    }

    setLoading(true);
    try {
      await addContribution(formData);
      toast.success("Deposit saved!");

      setFormData({
        planId: "",
        amount: "",
        date: "",
        note: "",
      });
    } catch (error) {
      toast.error("Failed to save deposit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${mainText}`}>Deposit Cash</h1>
        <p className={`text-sm ${mutedText}`}>
          Add a new contribution to your saving plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-6 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              isDark ? "bg-[#21B37A]/20 text-[#5DDCC7]" : "bg-[#DFF5ED] text-[#075C45]"
            }`}>
              <WalletCards size={22} />
            </div>

            <div>
              <h2 className={`text-xl font-bold ${mainText}`}>New deposit</h2>
              <p className={`text-sm ${mutedText}`}>
                Select a plan and enter your amount.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Saving plan
              </label>

              <select
                name="planId"
                value={formData.planId}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  isDark
                    ? "bg-[#1C1C1C] border-white/10 text-white"
                    : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"
                }`}
              >
                <option value="">Select a plan</option>

                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="₱0.00"
                max={
                  selectedPlan
                    ? selectedPlan.goalAmount - selectedPlan.savedAmount
                    : undefined
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  isDark
                    ? "bg-[#1C1C1C] border-white/10 text-white"
                    : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"
                }`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  isDark
                    ? "bg-[#1C1C1C] border-white/10 text-white"
                    : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"
                }`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Note
              </label>

              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="4"
                placeholder="Example: allowance, extra cash, gift..."
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none ${
                  isDark
                    ? "bg-[#1C1C1C] border-white/10 text-white"
                    : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"
                }`}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl px-5 py-3 text-sm font-bold text-white transition duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#21B37A] hover:bg-[#159A6A]"
              }`}
            >
              {loading ? "Processing..." : "Save deposit"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
            <p className={`text-sm font-semibold ${mutedText}`}>Selected plan</p>

            {selectedPlan ? (
              <>
                <h2 className={`mt-2 text-2xl font-bold ${mainText}`}>
                  {selectedPlan.title}
                </h2>

                <div className="mt-5 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[#21B37A]"
                    style={{
                      width: `${
                        (selectedPlan.savedAmount / selectedPlan.goalAmount) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className={`font-semibold ${mainText}`}>
                    ₱{selectedPlan.savedAmount.toLocaleString()}
                  </span>
                  <span className={mutedText}>
                    ₱{selectedPlan.goalAmount.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <p className={`mt-2 text-sm ${mutedText}`}>
                No saving plan selected.
              </p>
            )}
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
            <p className={`text-sm font-semibold ${mutedText}`}>
              Recent deposit
            </p>

            {recentDeposit ? (
              <>
                <h2 className={`mt-2 text-2xl font-bold ${
                  isDark ? "text-[#5DDCC7]" : "text-[#159A6A]"
                }`}>
                  ₱{recentDeposit.amount.toLocaleString()}
                </h2>
                <p className={`text-sm ${mutedText}`}>
                  {recentDeposit.planTitle} · {recentDeposit.date}
                </p>
              </>
            ) : (
              <p className={`mt-2 text-sm ${mutedText}`}>No deposits yet.</p>
            )}
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm ${
            isDark ? "bg-[#1C1C1C] border-white/10" : "bg-[#1C1C1C] border-black/10"
          }`}>
            <p className={`text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}>Tip</p>
            <h2 className="mt-2 text-lg font-bold text-white">
              Small deposits still count.
            </h2>
            <p className={`mt-2 text-sm ${
              isDark ? "text-gray-300" : "text-gray-400"
            }`}>
              Even ₱50 daily becomes ₱1,500 after one month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}