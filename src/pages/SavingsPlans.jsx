import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Plus, X } from "lucide-react";

export default function SavingPlans() {
  const navigate = useNavigate();
  const { plans, addPlan, updatePlan, deletePlan } = useApp();

  const { theme } = useAuth();
  const isDark = theme === "dark";

  const cardClass = isDark
    ? "bg-[#252525] text-white border-white/10"
    : "bg-white text-[#1C1C1C] border-black/10";

  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";
  const mutedText = isDark ? "text-gray-300" : "text-gray-500";

  const buttonClass = isDark
    ? "border-white/20 text-white hover:bg-white/10"
    : "border-black/20 text-[#1C1C1C] hover:bg-black/5";

  const [showForm, setShowForm] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    goalAmount: "",
    targetDate: "",
  });

  function handleEdit(plan) {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      goalAmount: plan.goalAmount,
      targetDate: plan.targetDate,
      status: plan.status,
    });
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title || !formData.goalAmount || !formData.targetDate) {
      toast("Please complete all fields.", {
        icon: "⚠️",
      });
      return;
    }

    if (editingPlan) {
      updatePlan({
        id: editingPlan.id,
        ...formData,
      });
    } else {
      addPlan(formData);
    }

    setFormData({
      title: "",
      goalAmount: "",
      targetDate: "",
    });

    setEditingPlan(null);
    setShowForm(false);
    toast.success(editingPlan ? "Plan updated!" : "Saving plan added!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${mainText}`}>Saving Plans</h1>
          <p className={`text-sm ${mutedText}`}>{plans.length} active plans</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold ${buttonClass}`}
        >
          <Plus size={18} />
          New plan
        </button>
      </div>

      {showForm && (
        <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${mainText}`}>
                {editingPlan ? "Edit saving plan" : "Create new saving plan"}
              </h2>
              <p className={`text-sm ${mutedText}`}>
                Set a goal and track your progress.
              </p>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className={`rounded-xl p-2 ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <X size={20} className={mainText} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Plan title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: New phone"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${isDark ? "bg-[#1C1C1C] border-white/10 text-white" : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"}`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Goal amount
              </label>
              <input
                type="number"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleChange}
                placeholder="₱0.00"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${isDark ? "bg-[#1C1C1C] border-white/10 text-white" : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"}`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${mainText}`}>
                Target date
              </label>
              <input
                type="text"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                placeholder="Example: Dec 2026"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${isDark ? "bg-[#1C1C1C] border-white/10 text-white" : "bg-[#F8F5F0] border-black/10 text-[#1C1C1C]"}`}
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#21B37A] px-5 py-3 text-sm font-bold text-white hover:bg-[#159A6A] md:col-span-3"
            >
              {editingPlan ? "Save changes" : "Save plan"}
            </button>
          </form>
        </div>
      )}

      {plans.length === 0 ? (
        <div className={`rounded-2xl border border-dashed p-10 text-center ${isDark ? "border-white/20 bg-[#252525]" : "border-black/20 bg-white"}`}>
          <p className={mutedText}>No saving plans yet</p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-xl bg-[#21B37A] px-5 py-3 text-white font-semibold"
          >
            Create your first plan
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {plans.map((plan) => {
          const percent = Math.min(
            Math.round((plan.savedAmount / plan.goalAmount) * 100),
            100
          );

          const remaining = plan.goalAmount - plan.savedAmount;

          const progressColor =
            plan.status === "On track"
              ? "#21B37A"
              : plan.status === "Slow"
              ? "#F0A429"
              : "#3B82F6";

          const badgeColor =
            plan.status === "On track"
              ? "bg-[#DFF5ED] text-[#075C45]"
              : plan.status === "Slow"
              ? "bg-[#FFF0D4] text-[#8A5A00]"
              : "bg-[#DBEAFE] text-[#1D4ED8]";

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${mainText}`}>
                    {plan.title}
                  </h2>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button
                    onClick={() => handleEdit(plan)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${buttonClass}`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => navigate("/app/deposit", { state: { planId: plan.id } })}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${buttonClass}`}
                  >
                    + Deposit
                  </button>

                  <button
                    onClick={() => {
                      toast((t) => (
                        <div className="flex flex-col gap-3">
                          <p>Delete this plan?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                deletePlan(plan.id);
                                toast.dismiss(t.id);
                                toast.success("Plan deleted");
                              }}
                              className="rounded-md bg-red-500 px-3 py-1 font-semibold text-white hover:bg-red-600"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => toast.dismiss(t.id)}
                              className={`rounded-md border px-3 py-1 font-semibold ${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ));
                    }}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${isDark ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3 text-center">
                <div>
                  <h3 className={`text-xl font-bold ${mainText}`}>
                    ₱{plan.savedAmount.toLocaleString()}
                  </h3>
                  <p className={`text-xs ${mutedText}`}>Saved</p>
                </div>

                <div>
                  <h3 className={`text-xl font-bold ${mainText}`}>
                    ₱{remaining.toLocaleString()}
                  </h3>
                  <p className={`text-xs ${mutedText}`}>Remaining</p>
                </div>

                <div>
                  <h3 className={`text-xl font-bold ${mainText}`}>
                    {plan.targetDate}
                  </h3>
                  <p className={`text-xs ${mutedText}`}>Target date</p>
                </div>
              </div>

              <div className={`h-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: progressColor,
                  }}
                ></div>
              </div>

              <div className={`mt-2 flex justify-between text-xs ${mutedText}`}>
                <span>{percent}% complete</span>
                <span>Goal: ₱{plan.goalAmount.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}