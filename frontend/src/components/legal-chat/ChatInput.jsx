import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveDomain } from "../../redux/legalCase.slice";
import { ALL_LANGUAGE_TRANSLATIONS } from "../../data/constitutionalLanguages.data";
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Briefcase,
  Home as HomeIcon,
  ShoppingBag,
  ShieldAlert,
  Sparkles,
  FileText,
  X,
  Zap,
  HelpCircle
} from "lucide-react";

export default function ChatInput({ onSendPrompt, disabled }) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const recognitionRef = useRef(null);
  const fileRef = useRef(null);

  const dispatch = useDispatch();
  const { activeDomain } = useSelector((state) => state.legalCase);
  const { language, languageMeta } = useSelector((state) => state.preferences);

  const t = ALL_LANGUAGE_TRANSLATIONS[language] || ALL_LANGUAGE_TRANSLATIONS.en;

  // Speech Recognition setup configured dynamically to the selected Indian language
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      // Use exact speech tag for the chosen constitutional language (e.g. gu-IN, ks-IN, bn-IN, etc.)
      recognition.lang = languageMeta?.speechCode || "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setValue(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language, languageMeta]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      // High-fidelity fallback for demo environments where mic is unavailable
      if (!isListening) {
        setIsListening(true);
        const sampleVoiceText = t.sampleVoice || "My employer terminated me without 30 days notice.";
        
        let i = 0;
        setValue("");
        const interval = setInterval(() => {
          if (i <= sampleVoiceText.length) {
            setValue(sampleVoiceText.slice(0, i));
            i += 3;
          } else {
            clearInterval(interval);
            setIsListening(false);
          }
        }, 40);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const domainPills = [
    { id: "auto", label: "Auto-Detect", icon: Sparkles },
    { id: "labour", label: t.domainLabour || "Labour Rights", icon: Briefcase },
    { id: "tenant", label: t.domainTenant || "Tenant Rights", icon: HomeIcon },
    { id: "consumer", label: t.domainConsumer || "Consumer Protection", icon: ShoppingBag },
    { id: "cyber", label: t.domainCyber || "Cyber Crime", icon: ShieldAlert },
    { id: "other", label: t.domainOther || "Other (RTI/Cheque)", icon: HelpCircle }
  ];

  const handleSend = () => {
    const prompt = value.trim();
    if (!prompt && !selectedFile) return;

    if (onSendPrompt) {
      onSendPrompt(prompt, activeDomain, selectedFile);
    }
    setValue("");
    setSelectedFile(null);
  };

  const handleQuickPromptClick = (quickText) => {
    if (onSendPrompt) {
      onSendPrompt(quickText, activeDomain, null);
    }
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentChips = t.quickPrompts || [
    "Landlord withholding ₹75,000 security deposit",
    "Terminated without 30-day notice & salary pending",
    "Fake electricity bill UPI phishing scam ₹45,000"
  ];

  return (
    <div className="w-full bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0 shadow-lg">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Domain Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Domain:
          </span>
          {domainPills.map((pill) => {
            const Icon = pill.icon;
            const isSelected = activeDomain === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => dispatch(setActiveDomain(pill.id))}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[#142B49] text-white border-[#142B49] shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={12} className={isSelected ? "text-[#D69B45]" : "text-slate-500"} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1-Click Demo Quick Prompts in Active Language */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] font-bold text-[#D69B45] uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Zap size={11} />
            Quick Demo:
          </span>
          {currentChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(chip)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-[#142B49] border border-amber-200/80 transition-colors cursor-pointer shrink-0 truncate max-w-xs active:scale-[0.98]"
            >
              "{chip}"
            </button>
          ))}
        </div>

        {/* Uploaded File Chip Preview */}
        {selectedFile && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <FileText size={15} className="text-[#142B49]" />
            <span className="font-semibold text-slate-800 truncate max-w-xs">{selectedFile.name}</span>
            <span className="text-[10px] text-slate-500">
              ({Math.round(selectedFile.size / 1024)} KB)
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer ml-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-[#142B49] rounded-2xl p-2 sm:p-2.5 transition-all shadow-inner">
          {/* File Upload Trigger */}
          <input
            ref={fileRef}
            type="file"
            hidden
            accept=".pdf,image/*,.doc,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="p-2 text-slate-500 hover:text-[#142B49] hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
            title="Attach Notice, Lease Agreement, or Evidence (PDF/Image)"
          >
            <Paperclip size={18} />
          </button>

          {/* Voice Input Trigger */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "text-slate-500 hover:text-[#142B49] hover:bg-slate-200/60"
            }`}
            title={`Speak grievance in ${languageMeta?.name || "your language"}`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Text Input */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder || "Describe your legal issue..."}
            rows={2}
            className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-[13px] text-slate-900 placeholder:text-slate-400 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-sans"
          />

          {/* Send Action */}
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || (!value.trim() && !selectedFile)}
            className={`p-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
              value.trim() || selectedFile
                ? "bg-[#142B49] hover:bg-[#1E3E68] text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Active Language: <strong>{languageMeta?.nativeName} ({languageMeta?.name})</strong></span>
          <span>Voice Code: <strong>{languageMeta?.speechCode || "en-IN"}</strong></span>
        </div>
      </div>
    </div>
  );
}
