import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FolderClock,
  FileText,
  ChevronRight,
  PlusCircle
} from "lucide-react";

export default function CaseManagementPage() {
  const { savedCases } = useSelector((state) => state.legalCase);
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B49] flex items-center gap-2">
            <FolderClock size={24} className="text-[#D69B45]" />
            <span>Citizen Case History & Notice Locker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your active legal grievances, issued statutory notices, and DLSA escalations.
          </p>
        </div>

        <button
          onClick={() => navigate("/assistant")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#142B49] hover:bg-[#1E3E68] text-white transition shadow-xs cursor-pointer"
        >
          <PlusCircle size={15} />
          <span>New Legal Inquiry</span>
        </button>
      </div>

      {/* Case List */}
      <div className="space-y-3">
        {savedCases.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#142B49]/40 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#142B49] flex items-center justify-center text-[#D69B45] shrink-0 mt-0.5">
                <FileText size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#142B49]">{c.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                    {c.domain}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Opposing Party: <strong>{c.opponent}</strong> • Claim Value:{" "}
                  <strong className="text-slate-800">{c.amountClaimed}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Latest Action: {c.lastAction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="text-right">
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {c.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{c.date}</p>
              </div>

              <button
                onClick={() => navigate("/drafting")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="View in Document Studio"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
