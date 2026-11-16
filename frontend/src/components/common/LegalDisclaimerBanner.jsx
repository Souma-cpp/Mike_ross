import { useDispatch, useSelector } from "react-redux";
import { dismissDisclaimer } from "../../redux/preferences.slice";
import { ALL_LANGUAGE_TRANSLATIONS } from "../../data/constitutionalLanguages.data";
import { Scale, X } from "lucide-react";

export default function LegalDisclaimerBanner() {
  const dispatch = useDispatch();
  const { disclaimerDismissed, language, languageMeta } = useSelector((state) => state.preferences);

  if (disclaimerDismissed) return null;

  const t = ALL_LANGUAGE_TRANSLATIONS[language] || ALL_LANGUAGE_TRANSLATIONS.en;

  return (
    <div className="bg-[#142B49] text-white border-b border-[#D69B45]/30 px-4 py-2 text-xs flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
        <Scale size={15} className="text-[#D69B45] shrink-0" />
        <span className="leading-tight text-slate-200">
          <strong className="text-[#D69B45]">
            [{languageMeta?.nativeName || "Legal Notice"}]:
          </strong>{" "}
          {t.disclaimer}
        </span>
      </div>
      <button
        onClick={() => dispatch(dismissDisclaimer())}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer ml-2"
        title="Dismiss notice"
      >
        <X size={14} />
      </button>
    </div>
  );
}
