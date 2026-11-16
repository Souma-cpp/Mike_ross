import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setLanguageModalOpen } from "../../redux/preferences.slice";
import { CONSTITUTIONAL_LANGUAGES } from "../../data/constitutionalLanguages.data";
import { Languages, Check, ChevronDown, X, Search } from "lucide-react";

export default function LanguageSelector() {
  const dispatch = useDispatch();
  const { language, languageMeta, languageModalOpen } = useSelector((state) => state.preferences);
  const [search, setSearch] = useState("");

  const filteredLanguages = CONSTITUTIONAL_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Navbar Language Pill & Dropdown Trigger */}
      <div className="flex items-center gap-1 bg-[#0D1C30] p-1 rounded-xl border border-white/10 shadow-xs">
        {/* Quick Bengali button */}
        <button
          onClick={() => dispatch(setLanguage("bn"))}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            language === "bn"
              ? "bg-[#D69B45] text-[#0D1C30] shadow-xs"
              : "text-slate-300 hover:text-white"
          }`}
          title="বাংলা (Bengali)"
        >
          বাংলা
        </button>

        {/* Quick Hindi button */}
        <button
          onClick={() => dispatch(setLanguage("hi"))}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            language === "hi"
              ? "bg-[#D69B45] text-[#0D1C30] shadow-xs"
              : "text-slate-300 hover:text-white"
          }`}
          title="हिन्दी (Hindi)"
        >
          हिन्दी
        </button>

        {/* Quick English button */}
        <button
          onClick={() => dispatch(setLanguage("en"))}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
            language === "en"
              ? "bg-[#D69B45] text-[#0D1C30] shadow-xs"
              : "text-slate-300 hover:text-white"
          }`}
          title="English"
        >
          EN
        </button>

        {/* All 22 Constitutional Languages Modal Opener */}
        <button
          onClick={() => dispatch(setLanguageModalOpen(true))}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#D69B45] transition cursor-pointer ml-0.5 border border-[#D69B45]/30"
          title="All 22 Constitutional Languages of India"
        >
          <Languages size={13} />
          <span className="hidden sm:inline">22 Languages</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* 22 Constitutional Languages Modal */}
      {languageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-[#142B49] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D69B45]/20 flex items-center justify-center border border-[#D69B45]/40 text-[#D69B45]">
                  <Languages size={20} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold flex items-center gap-2">
                    <span>22 Constitutional Languages of India</span>
                    <span className="text-[10px] font-bold bg-[#D69B45] text-[#0D1C30] px-2 py-0.5 rounded-full uppercase">
                      8th Schedule
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    Select your mother tongue for voice and text legal assistance
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(setLanguageModalOpen(false))}
                className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 focus-within:border-[#142B49]">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search language (e.g., Bengali, Tamil, Telugu, Marathi, Urdu)..."
                  className="w-full bg-transparent border-0 outline-none text-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Languages Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
              {filteredLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      dispatch(setLanguage(lang.code));
                      dispatch(setLanguageModalOpen(false));
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#142B49] text-white border-[#142B49] shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold font-serif leading-tight">
                        {lang.nativeName}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? "text-[#D69B45]" : "text-slate-500"}`}>
                        {lang.name}
                      </p>
                    </div>

                    {isSelected ? (
                      <Check size={16} className="text-[#D69B45]" />
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-slate-400">
                        {lang.speechCode.split("-")[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
              <span>Active Speech Engine: <strong>{languageMeta?.speechCode || "bn-IN"}</strong></span>
              <button
                onClick={() => dispatch(setLanguageModalOpen(false))}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
