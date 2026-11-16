import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LEGAL_DOMAINS } from "../data/legalDomains.data";
import { setActiveDomain } from "../redux/legalCase.slice";
import { setHelplineModalOpen } from "../redux/preferences.slice";
import { ALL_LANGUAGE_TRANSLATIONS } from "../data/constitutionalLanguages.data";
import {
  Scale,
  Briefcase,
  Home as HomeIcon,
  ShoppingBag,
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  FileText,
  FileCheck2,
  CheckCircle,
  Sparkles,
  HelpCircle
} from "lucide-react";

export default function CitizenDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedCases } = useSelector((state) => state.legalCase);
  const { language, languageMeta } = useSelector((state) => state.preferences);

  const t = ALL_LANGUAGE_TRANSLATIONS[language] || ALL_LANGUAGE_TRANSLATIONS.en;

  const domainIcons = {
    labour: Briefcase,
    tenant: HomeIcon,
    consumer: ShoppingBag,
    cyber: ShieldAlert,
    other: HelpCircle
  };

  const getDomainLocalizedName = (domainId) => {
    if (domainId === "labour") return t.domainLabour;
    if (domainId === "tenant") return t.domainTenant;
    if (domainId === "consumer") return t.domainConsumer;
    if (domainId === "cyber") return t.domainCyber;
    return t.domainOther;
  };

  const handleLaunchDomain = (domainId) => {
    dispatch(setActiveDomain(domainId));
    navigate("/assistant");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Hero Civic Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#142B49] via-[#1A365D] to-[#0D1C30] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D69B45]/20 text-[#D69B45] border border-[#D69B45]/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Digital Nyay • {languageMeta?.nativeName || "Bharat"} ({languageMeta?.name})</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 mt-2.5 leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => handleLaunchDomain("auto")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#0D1C30] bg-[#D69B45] hover:bg-[#C28732] transition-all shadow-md cursor-pointer"
            >
              <span>{t.startConsultation}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/contract-intelligence")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/15 transition cursor-pointer"
            >
              <FileCheck2 size={16} className="text-[#D69B45]" />
              <span>{t.contract}</span>
            </button>

            <button
              onClick={() => dispatch(setHelplineModalOpen(true))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-red-200 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 transition cursor-pointer"
            >
              <PhoneCall size={15} className="text-red-400" />
              <span>{t.helplineText}</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <Scale
          size={240}
          className="absolute -right-12 -bottom-16 text-white/[0.04] pointer-events-none"
        />
      </div>

      {/* 2. Primary Legal Domains */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#142B49]">
              {t.coreDomains}
            </h2>
            <p className="text-xs text-slate-500">
              Explore your legal rights in {languageMeta?.nativeName} ({languageMeta?.name})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEGAL_DOMAINS.map((domain) => {
            const Icon = domainIcons[domain.id] || Scale;
            const localizedName = getDomainLocalizedName(domain.id);
            return (
              <div
                key={domain.id}
                onClick={() => handleLaunchDomain(domain.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#142B49] shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#142B49] flex items-center justify-center text-[#D69B45] mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-[#142B49] group-hover:text-[#D69B45] transition-colors">
                    {localizedName || domain.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {language === "bn" ? domain.shortDescBn : language === "hi" ? domain.shortDescHi : domain.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#142B49]">
                  <span>{t.exploreRights || "Explore Rights"}</span>
                  <ArrowRight size={14} className="text-[#D69B45] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Active Citizen Inquiries & Recent Drafts Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Cases */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#142B49]" />
              <h3 className="text-sm font-bold text-[#142B49]">
                {t.cases}
              </h3>
            </div>
            <button
              onClick={() => navigate("/cases")}
              className="text-xs font-semibold text-[#D69B45] hover:underline cursor-pointer"
            >
              View All ({savedCases.length})
            </button>
          </div>

          <div className="space-y-3">
            {savedCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate("/cases")}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#142B49]/40 transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#142B49]/10 flex items-center justify-center text-[#142B49]">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#142B49]">{c.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Opponent: {c.opponent} • Claim: <strong>{c.amountClaimed}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {c.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Emergency Redressal Desk */}
        <div className="bg-[#142B49] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PhoneCall size={20} className="text-[#D69B45]" />
              <h3 className="text-sm font-bold">
                24x7 Citizen Legal Aid & Cyber Freeze
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Access Government of India emergency numbers immediately. Available in {languageMeta?.name || "all languages"}.
            </p>

            <div className="space-y-2.5">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300">
                    National Cyber Crime 1930
                  </span>
                  <a href="tel:1930" className="text-xs font-bold bg-red-600 px-2 py-0.5 rounded text-white">Call 1930</a>
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  Freeze fraudulent transactions within 24h
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D69B45]">
                    NALSA Free Legal Aid 15100
                  </span>
                  <a href="tel:15100" className="text-xs font-bold bg-[#D69B45] px-2 py-0.5 rounded text-[#0D1C30]">Call 15100</a>
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  Free court advocate for eligible citizens
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => dispatch(setHelplineModalOpen(true))}
            className="w-full mt-4 py-2 rounded-xl text-xs font-bold bg-white text-[#142B49] hover:bg-slate-100 transition shadow-xs cursor-pointer"
          >
            View All Helplines
          </button>
        </div>
      </div>
    </div>
  );
}
