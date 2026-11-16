import { useState } from "react";
import { LegalMockService } from "../features/legalMock.service";
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function ContractScannerPage() {
  const [contractType, setContractType] = useState("rental");
  const audit = LegalMockService.getContractAudit(contractType);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B49] flex items-center gap-2">
            <FileCheck2 size={24} className="text-[#D69B45]" />
            <span>AI Contract Intelligence & Risk Scanner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect one-sided, unenforceable, and unfair clauses in Indian rental agreements and employment contracts.
          </p>
        </div>

        {/* Contract Type Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setContractType("rental")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              contractType === "rental"
                ? "bg-[#142B49] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rental Agreement Audit
          </button>
          <button
            onClick={() => setContractType("employment")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              contractType === "employment"
                ? "bg-[#142B49] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Employment Bond Audit
          </button>
        </div>
      </div>

      {/* Overview Risk Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Scanned File:
            </span>
            <span className="text-xs font-bold text-[#142B49] bg-slate-100 px-2.5 py-0.5 rounded-md">
              {audit.fileName}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#142B49]">{audit.contractType}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{audit.findingsSummary}</p>
        </div>

        {/* Risk Score Pill */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Risk Assessment</p>
            <p className="text-3xl font-black text-red-600">{audit.riskScore}/100</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase">
              {audit.overallRisk} RISK
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Requires Amendment</p>
          </div>
        </div>
      </div>

      {/* Clause by Clause Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#142B49] flex items-center gap-2">
          <AlertTriangle size={16} className="text-[#D69B45]" />
          <span>Identified High-Risk & Unenforceable Clauses ({audit.clauses.length})</span>
        </h3>

        <div className="space-y-4">
          {audit.clauses.map((clause, idx) => (
            <div
              key={clause.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#142B49]/40 transition"
            >
              {/* Clause Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#142B49] text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-[#142B49]">{clause.clauseTitle}</h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    clause.riskLevel === "CRITICAL"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {clause.riskLevel} Risk
                </span>
              </div>

              {/* Clause Details */}
              <div className="p-5 space-y-3.5">
                {/* Original Text */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Original Agreement Wording:
                  </p>
                  <p className="text-xs font-serif italic text-red-900 bg-red-50/60 p-3 rounded-xl border border-red-100">
                    "{clause.originalText}"
                  </p>
                </div>

                {/* Legal Explanation */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Indian Law Analysis:
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {clause.issueExplanation}
                  </p>
                </div>

                {/* Fair Replacement */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-emerald-700 mb-1 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Recommended Fair Statutory Counter-Clause:
                  </p>
                  <p className="text-xs font-serif text-slate-800 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    {clause.recommendedRevision}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
