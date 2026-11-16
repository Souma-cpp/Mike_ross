import { useState } from "react";
import { LegalMockService } from "../features/legalMock.service";
import {
  BookOpen,
  Search,
  Scale,
  Filter
} from "lucide-react";

export default function PrecedentFinderPage() {
  const [query, setQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");

  const precedents = LegalMockService.searchPrecedents(query, domainFilter);

  const filters = [
    { id: "all", label: "All Judgments" },
    { id: "tenant", label: "Tenant & Housing" },
    { id: "labour", label: "Labour & Wages" },
    { id: "consumer", label: "Consumer Forum" },
    { id: "cyber", label: "Cyber & IT Act" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B49] flex items-center gap-2">
          <BookOpen size={24} className="text-[#D69B45]" />
          <span>Indian Case Law Precedent Finder</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search authoritative rulings from the Supreme Court of India and High Courts establishing citizen protections.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-[#142B49] rounded-xl px-3 py-2 transition">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keywords (e.g. security deposit, wrongful dismissal, SIM swap, airline refund)..."
            className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Filter size={13} className="text-slate-400 mr-1" />
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setDomainFilter(f.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer shrink-0 ${
                domainFilter === f.id
                  ? "bg-[#142B49] text-white border-[#142B49]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Found {precedents.length} Landmark Precedents
        </p>

        {precedents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Scale size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No rulings matched your search</p>
            <p className="text-xs text-slate-400 mt-1">Try keywords like 'tenant', 'salary', 'fraud', or 'deposit'.</p>
          </div>
        ) : (
          precedents.map((prec) => (
            <div
              key={prec.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#142B49]/40 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#142B49] font-serif">
                      {prec.caseTitle}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {prec.domain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {prec.court} • Bench: {prec.bench} • {prec.year}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#142B49] bg-[#D69B45]/15 border border-[#D69B45]/30 px-2.5 py-1 rounded-lg">
                    {prec.citation}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    {prec.relevanceScore}% Match
                  </span>
                </div>
              </div>

              {/* Ruling Summary */}
              <div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {prec.summary}
                </p>
              </div>

              {/* Legal Principle Quote */}
              <div className="bg-amber-50/70 border-l-3 border-[#D69B45] p-3 rounded-r-xl">
                <p className="text-[10px] font-bold uppercase text-[#D69B45] mb-0.5">
                  Established Legal Principle:
                </p>
                <p className="text-xs font-serif italic text-slate-800">
                  "{prec.principle}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
