import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerOpen, setActiveDraft } from "../../redux/legalCase.slice";
import {
  Scale,
  FileText,
  Copy,
  Check,
  ArrowRight,
  Printer
} from "lucide-react";

export default function MessageBubble({ role, content, images = [], draftNotice }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const { activeDraft } = useSelector((state) => state.legalCase);

  const currentDraft = draftNotice || activeDraft;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenDraftStudio = () => {
    if (currentDraft) {
      dispatch(setActiveDraft(currentDraft));
      dispatch(setDrawerOpen(true));
    }
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[94%] md:max-w-[82%] rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
          isUser
            ? "bg-[#142B49] text-white rounded-tr-xs"
            : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-sm"
        }`}
      >
        {/* Assistant Header Badge */}
        {!isUser && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#D69B45]/20 flex items-center justify-center">
                <Scale size={13} className="text-[#D69B45]" />
              </div>
              <span className="text-xs font-bold text-[#142B49]">
                NyaySetu Legal Assessment
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                Verified Jurisprudence
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#142B49] p-1 rounded-md transition cursor-pointer"
              title="Copy legal advice"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy Advice"}</span>
            </button>
          </div>
        )}

        {/* User Attached Images */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Document evidence"
                className="w-32 h-24 rounded-lg object-cover border border-white/20"
              />
            ))}
          </div>
        )}

        {/* Markdown Content */}
        <div className={`prose prose-sm max-w-none leading-relaxed ${isUser ? "text-white prose-invert" : "text-slate-800"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-[#142B49]">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2 text-[#142B49]">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1 text-[#142B49] flex items-center gap-1.5">{children}</h3>,
              h4: ({ children }) => <h4 className="text-xs font-bold uppercase tracking-wider text-[#D69B45] mt-3 mb-1">{children}</h4>,
              p: ({ children }) => <p className="mb-2.5 text-xs sm:text-[13px] leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-3 text-xs sm:text-[13px]">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-3 text-xs sm:text-[13px]">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-3 border-[#D69B45] bg-amber-50/70 text-slate-700 pl-3 py-1.5 my-2.5 rounded-r-lg text-xs italic">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-slate-100 text-[#142B49] px-1.5 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
                  {children}
                </code>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Prominent Action Callout for Generated Legal Draft */}
        {!isUser && currentDraft && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="bg-gradient-to-r from-[#142B49]/5 via-amber-50/50 to-white border border-[#142B49]/15 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#142B49] flex items-center justify-center text-[#D69B45] shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#142B49]">{currentDraft.title}</p>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Ready to Issue
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Personalized draft ready to review, customize with dates/names, print, or export as PDF.
                  </p>
                </div>
              </div>

              <button
                onClick={handleOpenDraftStudio}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#142B49] hover:bg-[#1E3E68] text-white transition shadow-sm cursor-pointer shrink-0 active:scale-95"
              >
                <span>Open Notice Studio</span>
                <ArrowRight size={14} className="text-[#D69B45]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
