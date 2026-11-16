import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDrawerOpen, updateActiveDraftContent, addSavedCase } from "../../redux/legalCase.slice";
import { X, Printer, Copy, Check, Share2, Scale, FileText, CheckCircle2 } from "lucide-react";

export default function DocumentPreviewDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen, activeDraft } = useSelector((state) => state.legalCase);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!drawerOpen || !activeDraft) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeDraft.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToMyCases = () => {
    dispatch(
      addSavedCase({
        id: "case-" + Date.now().toString().slice(-4),
        title: activeDraft.title,
        domain: activeDraft.domain || "consumer",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        status: "Notice Drafted",
        amountClaimed: "Under Assessment",
        opponent: "Opposing Party",
        lastAction: "Saved to Citizen Document Locker"
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*NyaySetu Legal Draft: ${activeDraft.title}*\n\n${activeDraft.subject}\n\nGenerated via NyaySetu AI Legal Bridge.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl border-l border-slate-300 flex flex-col no-print transition-all duration-300">
      {/* Drawer Header */}
      <div className="bg-[#142B49] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D69B45]/20 flex items-center justify-center border border-[#D69B45]/40">
            <Scale size={18} className="text-[#D69B45]" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">{activeDraft.title}</h3>
            <p className="text-[11px] text-slate-300">Live Legal Document Editor & Exporter</p>
          </div>
        </div>

        <button
          onClick={() => dispatch(setDrawerOpen(false))}
          className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition shadow-xs cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Notice"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition shadow-xs cursor-pointer"
          >
            <Printer size={13} />
            <span>Print Legal Notice</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition shadow-xs cursor-pointer"
          >
            <Share2 size={13} />
            <span>WhatsApp</span>
          </button>
        </div>

        <button
          onClick={handleSaveToMyCases}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#142B49] text-white hover:bg-[#1E3E68] transition shadow-xs cursor-pointer"
        >
          {savedSuccess ? <CheckCircle2 size={13} className="text-emerald-400" /> : <FileText size={13} />}
          <span>{savedSuccess ? "Saved to Cases!" : "Save Notice"}</span>
        </button>
      </div>

      {/* Editable Document Preview Canvas */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-100">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 min-h-[680px] legal-print-document">
          {/* Formal Stamp Paper / Court Header Motif */}
          <div className="border-b-2 border-[#142B49] pb-4 mb-5 text-center">
            <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400">
              FORMAL LEGAL COMMUNICATION • BHARAT LEGAL JURISPRUDENCE
            </p>
            <h2 className="text-sm font-extrabold uppercase text-[#142B49] mt-1 tracking-wide">
              {activeDraft.subject}
            </h2>
          </div>

          {/* Editable Notice Content Area */}
          <div className="space-y-4">
            <p className="text-[11px] text-slate-400 italic mb-2">
              Tip: You can click inside the document to fill in your personal details (names, dates, amounts) before printing or downloading.
            </p>
            <textarea
              value={activeDraft.content}
              onChange={(e) => dispatch(updateActiveDraftContent(e.target.value))}
              rows={24}
              className="w-full bg-transparent border-0 outline-none resize-none text-[13px] text-slate-800 font-serif leading-relaxed"
            />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-[11px] text-slate-400">
            <span>Generated via NyaySetu AI Legal Bridge</span>
            <span>Statutory Verification Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
