import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  FileCheck2,
  BookOpen,
  Users,
  FolderClock,
  Menu,
  X,
  PlusCircle,
  Briefcase,
  Home as HomeIcon,
  ShoppingBag,
  ShieldAlert,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { setMessages } from "../../redux/message.slice";
import { setActiveDomain, setClassifiedResult } from "../../redux/legalCase.slice";
import { ALL_LANGUAGE_TRANSLATIONS } from "../../data/constitutionalLanguages.data";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { savedCases } = useSelector((state) => state.legalCase);
  const { language, languageMeta } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const t = ALL_LANGUAGE_TRANSLATIONS[language] || ALL_LANGUAGE_TRANSLATIONS.en;

  const navItems = [
    {
      to: "/",
      label: t.dashboard,
      icon: LayoutDashboard
    },
    {
      to: "/assistant",
      label: t.assistant,
      icon: MessageSquare,
      badge: "Multimodal"
    },
    {
      to: "/drafting",
      label: t.drafting,
      icon: FileText
    },
    {
      to: "/contract-intelligence",
      label: t.contract,
      icon: FileCheck2
    },
    {
      to: "/precedents",
      label: t.precedents,
      icon: BookOpen
    },
    {
      to: "/lawyer-connect",
      label: t.lawyer,
      icon: Users
    },
    {
      to: "/cases",
      label: t.cases,
      icon: FolderClock
    }
  ];

  const domainIcons = {
    labour: Briefcase,
    tenant: HomeIcon,
    consumer: ShoppingBag,
    cyber: ShieldAlert,
    other: HelpCircle
  };

  const handleStartNewConsultation = () => {
    dispatch(setMessages([]));
    dispatch(setActiveDomain("auto"));
    dispatch(setClassifiedResult({ domain: null, rights: [], precedents: [], draftNotice: null }));
    navigate("/assistant");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 p-2 rounded-lg bg-[#142B49] text-white border border-white/10 shadow-md cursor-pointer"
        aria-label="Open Navigation Menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-68 h-screen shrink-0
          transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="relative h-full flex flex-col bg-[#0D1C30] text-slate-200 border-r border-[#142B49] select-none">
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden absolute top-3 right-3 z-50 text-slate-300 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X size={18} />
            </button>
          )}

          {/* Action: New Consultation */}
          <div className="p-4 border-b border-white/5">
            <button
              onClick={handleStartNewConsultation}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-[#0D1C30] bg-[#D69B45] hover:bg-[#C28732] shadow-md transition-all duration-150 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>{t.newInquiry}</span>
            </button>
          </div>

          {/* Primary Navigation Menu */}
          <div className="px-3 py-3 space-y-1">
            <p className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-400">
              {languageMeta?.name || "Constitutional"} Legal Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[#142B49] text-white font-bold border-l-3 border-[#D69B45] shadow-sm"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-[#D69B45]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D69B45]/20 text-[#D69B45] font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Saved Case History / Recent Inquiries */}
          <div className="flex-1 overflow-y-auto px-3 py-2 border-t border-white/5">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                {t.cases}
              </p>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                {savedCases.length}
              </span>
            </div>

            <div className="space-y-1 mt-1">
              {savedCases.map((c) => {
                const Icon = domainIcons[c.domain] || MessageSquare;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate("/cases");
                      setMobileOpen(false);
                    }}
                    className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all cursor-pointer border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[#142B49] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={12} className="text-[#D69B45]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                          {c.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {c.date} • {c.amountClaimed}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-500 group-hover:text-slate-300 shrink-0 ml-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Branding Badge */}
          <div className="p-3.5 border-t border-white/5 bg-[#091424] text-[11px] text-slate-400 text-center">
            <p className="font-semibold text-slate-300">NyaySetu Bharat • v2.0</p>
            <p className="text-[10px] text-[#D69B45] font-bold mt-0.5">
              {languageMeta?.nativeName} ({languageMeta?.name})
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
