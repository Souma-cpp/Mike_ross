import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageBubble from "./MessageBubble";
import { LEGAL_DOMAINS } from "../../data/legalDomains.data";
import { setActiveDomain } from "../../redux/legalCase.slice";
import {
  Scale,
  Briefcase,
  Home as HomeIcon,
  ShoppingBag,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle
} from "lucide-react";

const LEGAL_STEPS = [
  "Analyzing grievance under Indian laws...",
  "Classifying legal domain & statutory jurisdiction...",
  "Retrieving Supreme Court & High Court precedents...",
  "Synthesizing citizen rights & generating legal notice draft..."
];

function LegalReasoningIndicator() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LEGAL_STEPS.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mb-4">
      <div className="relative w-8 h-8 rounded-xl bg-[#142B49] flex items-center justify-center shrink-0">
        <Scale size={16} className="text-[#D69B45] animate-pulse" />
      </div>
      <div>
        <p className="text-xs font-bold text-[#142B49] flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#D69B45]" />
          NyaySetu AI Legal Reasoning
        </p>
        <p className="text-xs text-slate-500 transition-all duration-300">
          {LEGAL_STEPS[stepIndex]}
        </p>
      </div>
    </div>
  );
}

export default function MessageList({ onTriggerPrompt }) {
  const bottomRef = useRef(null);
  const { messages, isLoading } = useSelector((state) => state.message);
  const { language } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();

  const domainIcons = {
    labour: Briefcase,
    tenant: HomeIcon,
    consumer: ShoppingBag,
    cyber: ShieldAlert,
    other: HelpCircle
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const handleCardClick = (domainId, prompt) => {
    dispatch(setActiveDomain(domainId));
    if (onTriggerPrompt) {
      onTriggerPrompt(prompt, domainId);
    }
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Welcome Hero */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#142B49] text-[#D69B45] shadow-md mb-2.5 border border-[#D69B45]/30">
            <Scale size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142B49]">
            {language === "hi"
              ? "नमस्ते! न्यायसेतु कानूनी सहायता में आपका स्वागत है"
              : "NyaySetu • Multimodal AI Legal Consultation"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
            {language === "hi"
              ? "नीचे दिए गए किसी भी मामले पर क्लिक करें, या अपना कोई भी प्रश्न नीचे सीधे टाइप/बोलकर पूछें।"
              : "Click any scenario card below to run an instant analysis, or type/speak your problem in the bar below."}
          </p>
        </div>

        {/* 5 Interactive Legal Domain Starter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-3">
          {LEGAL_DOMAINS.map((domain) => {
            const Icon = domainIcons[domain.id] || Scale;
            return (
              <div
                key={domain.id}
                onClick={() => handleCardClick(domain.id, domain.samplePrompts[0])}
                className="bg-white border border-slate-200 hover:border-[#142B49] hover:bg-slate-50/50 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#142B49] flex items-center justify-center text-[#D69B45] group-hover:scale-105 transition-transform">
                        <Icon size={14} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#142B49] group-hover:text-[#D69B45] transition-colors">
                          {language === "hi" ? domain.nameHi : domain.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {domain.keyActs[0].split(",")[0]}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      1-Click
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                    {language === "hi" ? domain.shortDescHi : domain.shortDesc}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-[#142B49] font-semibold bg-[#142B49]/5 p-1.5 rounded-lg group-hover:bg-[#142B49] group-hover:text-white transition-all">
                    <div className="flex items-center gap-1 min-w-0">
                      <Zap size={12} className="text-[#D69B45] shrink-0" />
                      <span className="truncate">"{domain.samplePrompts[0]}"</span>
                    </div>
                    <ArrowRight size={12} className="shrink-0 text-[#D69B45] ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Universal Legal Question Banner for Non-Matching Problems */}
        <div className="w-full bg-[#142B49]/5 border border-[#142B49]/15 rounded-2xl p-3 text-center">
          <p className="text-xs font-bold text-[#142B49] flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-[#D69B45]" />
            Have a different legal issue? (Cheque bounce, RTI, Police inaction, Divorce, Boundary dispute, etc.)
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Simply <strong>type in the box below or click the microphone to speak</strong>. NyaySetu analyzes all Indian statutes, explains your remedies, and drafts a custom legal demand notice!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          role={msg.role}
          content={msg.content}
          images={msg.images || []}
          draftNotice={msg.draftNotice}
        />
      ))}

      {isLoading && <LegalReasoningIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
