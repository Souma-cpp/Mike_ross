import { useState } from "react";
import { LegalMockService } from "../features/legalMock.service";
import {
  Users,
  Scale,
  PhoneCall,
  MessageCircle,
  ShieldCheck
} from "lucide-react";

export default function LawyerConnectPage() {
  const [cityFilter, setCityFilter] = useState("all");
  const [legalAidOnly, setLegalAidOnly] = useState(false);

  const lawyers = LegalMockService.getLawyers(cityFilter, legalAidOnly);

  const cities = ["all", "New Delhi", "Bengaluru", "Mumbai", "Kolkata"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B49] flex items-center gap-2">
          <Users size={24} className="text-[#D69B45]" />
          <span>Advocate Escalation & Free Legal Aid (DLSA)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Connect with District Legal Services Authority (DLSA) Panel Advocates for free citizen aid or consult verified High Court practitioners.
        </p>
      </div>

      {/* Free Legal Aid Entitlement Advisory Banner */}
      <div className="bg-[#142B49] text-white p-5 rounded-2xl shadow-md border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D69B45] flex items-center justify-center shrink-0 text-[#0D1C30]">
            <Scale size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Are you entitled to 100% Free Legal Aid in India?
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Under <strong>Section 12 of the Legal Services Authorities Act, 1987</strong>, women, senior citizens, industrial workers, SC/ST, and individuals earning under ₹3 Lakhs/year are entitled to free government-funded legal counsel.
            </p>
          </div>
        </div>

        <button
          onClick={() => setLegalAidOnly(!legalAidOnly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0 ${
            legalAidOnly
              ? "bg-[#D69B45] text-[#0D1C30]"
              : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
          }`}
        >
          {legalAidOnly ? "Showing DLSA Free Aid Only" : "Filter: Free Legal Aid Only"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs overflow-x-auto [scrollbar-width:none]">
        <span className="text-xs font-bold text-slate-400 px-2 shrink-0">City:</span>
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCityFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              cityFilter === c
                ? "bg-[#142B49] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {c === "all" ? "All Indian Cities" : c}
          </button>
        ))}
      </div>

      {/* Lawyers & Panel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#142B49]/40 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#142B49]">{lawyer.name}</h3>
                    <ShieldCheck size={16} className="text-[#D69B45]" />
                  </div>
                  <p className="text-xs text-slate-500">{lawyer.designation}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lawyer.city}, {lawyer.state} • {lawyer.court}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    lawyer.freeLegalAidEligible
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  {lawyer.type}
                </span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {lawyer.specialization.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Free Aid / Fee Info */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                {lawyer.freeLegalAidEligible ? (
                  <p className="text-emerald-800 font-medium text-[11px]">
                    <strong>Eligibility:</strong> {lawyer.freeEligibilityCriteria}
                  </p>
                ) : (
                  <p className="text-slate-700 font-medium text-[11px]">
                    <strong>Fee:</strong> {lawyer.consultationFee}
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Phone & WhatsApp */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${lawyer.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#142B49] hover:bg-[#1E3E68] text-white text-xs font-bold transition shadow-xs"
              >
                <PhoneCall size={13} />
                <span>Call Chamber</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=${lawyer.whatsapp}&text=${encodeURIComponent(
                  "Namaste Advocate, I am contacting you via NyaySetu Legal Assistant for consultation."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
