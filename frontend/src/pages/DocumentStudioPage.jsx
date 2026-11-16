import { useState } from "react";
import { useDispatch } from "react-redux";
import { DOCUMENT_TEMPLATES } from "../data/documentTemplates.data";
import { addSavedCase } from "../redux/legalCase.slice";
import {
  FileText,
  Printer,
  Copy,
  Check,
  CheckCircle2
} from "lucide-react";

export default function DocumentStudioPage() {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState("tenant_deposit");
  const [citizenName, setCitizenName] = useState("Rahul Verma");
  const [opponentName, setOpponentName] = useState("Suresh Kumar (Property Owner)");
  const [amount, setAmount] = useState("₹75,000");
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const template = DOCUMENT_TEMPLATES[selectedKey];

  // Dynamic template interpolation
  const getRenderedContent = () => {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    return template.body
      .replace(/\[Current Date\]/g, today)
      .replace(/\[Date\]/g, today)
      .replace(/\[Tenant Name\]/g, citizenName)
      .replace(/\[Employee Name\]/g, citizenName)
      .replace(/\[Consumer Name\]/g, citizenName)
      .replace(/\[Complainant Name\]/g, citizenName)
      .replace(/\[Landlord\/Owner Name\]/g, opponentName)
      .replace(/\[Company\/Employer Legal Entity Name\]/g, opponentName)
      .replace(/\[Company Name \/ Customer Grievance Officer\]/g, opponentName)
      .replace(/\[Deposit Amount\]/g, amount)
      .replace(/\[Unpaid Salary Amount\]/g, amount)
      .replace(/\[Amount Paid\]/g, amount)
      .replace(/\[Defrauded Amount\]/g, amount);
  };

  const renderedText = getRenderedContent();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(renderedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToCases = () => {
    dispatch(
      addSavedCase({
        id: "case-" + Date.now().toString().slice(-4),
        title: template.title,
        domain: template.domain,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        status: "Draft Ready",
        amountClaimed: amount,
        opponent: opponentName,
        lastAction: "Saved from Document Studio"
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#142B49] flex items-center gap-2">
          <FileText size={24} className="text-[#D69B45]" />
          <span>Legal Document & Notice Studio</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate formal statutory notices under Indian law compliant with standard High Court formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Template Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Template Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Select Legal Notice Type
            </h3>
            <div className="space-y-2">
              {Object.entries(DOCUMENT_TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedKey === key
                      ? "bg-[#142B49] text-white border-[#142B49] shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <p>{t.title}</p>
                  <span className={`text-[10px] font-normal uppercase ${selectedKey === key ? "text-[#D69B45]" : "text-slate-400"}`}>
                    Domain: {t.domain}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Details Customizer */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Personalize Notice Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Citizen / Complainant Name
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#142B49] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opposing Party (Landlord / Employer / Brand)
              </label>
              <input
                type="text"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#142B49] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disputed Amount / Claim Value
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#142B49] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Legal Notice Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Action Toolbar */}
          <div className="bg-white p-3 rounded-t-2xl border border-b-0 border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Document</span>
              </button>
            </div>

            <button
              onClick={handleSaveToCases}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#142B49] text-white hover:bg-[#1E3E68] transition cursor-pointer shadow-xs"
            >
              {savedSuccess ? <CheckCircle2 size={14} className="text-emerald-400" /> : <FileText size={14} />}
              <span>{savedSuccess ? "Saved to Cases!" : "Save Notice"}</span>
            </button>
          </div>

          {/* Paper Canvas */}
          <div className="bg-slate-200 p-4 sm:p-6 rounded-b-2xl border border-slate-200 overflow-y-auto max-h-[750px]">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 legal-print-document">
              <div className="text-center border-b-2 border-[#142B49] pb-4 mb-6">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400">
                  STATUTORY NOTICE • BHARAT LEGAL TECH STANDARD
                </p>
                <h3 className="text-sm font-extrabold uppercase text-[#142B49] mt-1 tracking-wide">
                  {template.subject}
                </h3>
              </div>

              <pre className="text-xs sm:text-[13px] font-serif whitespace-pre-wrap leading-relaxed text-slate-800 font-normal">
                {renderedText}
              </pre>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
                <span>Verified under Indian Jurisprudence</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
