import { useDispatch, useSelector } from "react-redux";
import { setHelplineModalOpen } from "../../redux/preferences.slice";
import { ALL_LANGUAGE_TRANSLATIONS } from "../../data/constitutionalLanguages.data";
import LanguageSelector from "../common/LanguageSelector";
import { Scale, PhoneCall, MessageCircle, ShieldCheck, User } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { language, languageMeta } = useSelector((state) => state.preferences);
  const { userData } = useSelector((state) => state.user);

  const t = ALL_LANGUAGE_TRANSLATIONS[language] || ALL_LANGUAGE_TRANSLATIONS.en;

  return (
    <header className="h-16 bg-[#142B49] text-white border-b border-[#0D1C30] px-3 sm:px-6 flex items-center justify-between shadow-md shrink-0 z-30">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D69B45] to-[#B3792A] flex items-center justify-center shadow-sm shrink-0">
          <Scale size={22} className="text-[#0D1C30]" strokeWidth={2.5} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>NyaySetu</span>
              <span className="text-[#D69B45] font-serif text-xs sm:text-sm font-normal">
                {t.brandScript}
              </span>
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D69B45]/20 text-[#D69B45] border border-[#D69B45]/30">
              <ShieldCheck size={11} />
              {languageMeta?.name || "Bharat"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-300 hidden sm:block truncate max-w-md">
            {t.brandSubtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Emergency Helpline Pill */}
        <button
          onClick={() => dispatch(setHelplineModalOpen(true))}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white transition-all shadow-xs animate-pulse cursor-pointer shrink-0"
          title="Emergency Legal & Cyber Helplines"
        >
          <PhoneCall size={12} />
          <span className="hidden xs:inline">{t.helplineText}</span>
          <span className="xs:hidden">1930</span>
        </button>

        {/* 22 Constitutional Languages Selector */}
        <LanguageSelector />

        {/* WhatsApp Demo Integration Button */}
        <button
          onClick={() => alert(`NyaySetu WhatsApp Bot: Citizens can message in ${languageMeta?.name || "their language"} to +91 98765 43210 to receive instant legal advice and PDF drafts directly on WhatsApp.`)}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors cursor-pointer"
          title="WhatsApp Legal Bot"
        >
          <MessageCircle size={14} className="text-emerald-400" />
          <span>WhatsApp</span>
        </button>

        {/* Citizen Profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-[#D69B45]">
            {userData?.name ? userData.name.charAt(0) : <User size={15} className="text-slate-300" />}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold leading-tight text-white">{userData?.name || "Citizen Portal"}</p>
            <p className="text-[10px] text-slate-400">Verified Citizen</p>
          </div>
        </div>
      </div>
    </header>
  );
}
