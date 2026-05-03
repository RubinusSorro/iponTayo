import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function CashHistory() {
  const { contributions, deleteContribution } = useApp();
  const { theme } = useAuth();

  const isDark = theme === "dark";

  const cardClass = isDark
    ? "bg-[#252525] text-white border-white/10"
    : "bg-white text-[#1C1C1C] border-black/10";

  const mutedText = isDark ? "text-gray-300" : "text-gray-500";
  const mainText = isDark ? "text-white" : "text-[#1C1C1C]";

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${mainText}`}>Deposit History</h1>
        <p className={`text-sm ${mutedText}`}>
          View and manage your deposit records.
        </p>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
        {contributions.length === 0 ? (
          <div className="text-center py-10">
            <p className={mutedText}>No deposit history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between border-b pb-4 last:border-0 ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <div>
                  <h2 className={`font-bold ${mainText}`}>
                    {item.planTitle}
                  </h2>
                  <p className={`text-sm ${mutedText}`}>
                    {new Date(
                      item.createdAt?.toDate
                        ? item.createdAt.toDate()
                        : item.createdAt
                    ).toLocaleDateString()} {item.note && `• ${item.note}`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className={`font-bold ${
                    isDark ? "text-[#5DDCC7]" : "text-[#159A6A]"
                  }`}>
                    +₱{item.amount.toLocaleString()}
                  </p>

                  <button
                    onClick={() => {
                      toast((t) => (
                        <div className="flex flex-col gap-3">
                          <p>Delete this deposit?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                deleteContribution(item.id);
                                toast.dismiss(t.id);
                                toast.success("Deposit deleted");
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
                    className={`rounded-xl border p-3 ${isDark ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-red-200 text-red-500 hover:bg-red-50"}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}