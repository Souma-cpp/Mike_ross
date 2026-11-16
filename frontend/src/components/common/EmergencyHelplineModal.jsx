import { useDispatch, useSelector } from "react-redux";
import { setHelplineModalOpen } from "../../redux/preferences.slice";
import { EMERGENCY_HELPLINES } from "../../data/legalDomains.data";
import { X, PhoneCall, ShieldAlert } from "lucide-react";

export default function EmergencyHelplineModal() {
  const dispatch = useDispatch();
  const { helplineModalOpen, language } = useSelector((state) => state.preferences);

  if (!helplineModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#142B49] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D69B45]/20 flex items-center justify-center border border-[#D69B45]/40">
              <PhoneCall className="text-[#D69B45]" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === "bn"
                  ? "জরুরি সরকারি আইনি ও সাইবার হেল্পলাইন"
                  : language === "hi"
                  ? "आपातकालीन कानूनी हेल्पलाइन"
                  : "Official Legal & Cyber Helplines"}
              </h2>
              <p className="text-xs text-slate-300">
                {language === "bn"
                  ? "ভারত সরকার দ্বারা পরিচালিত ২৪x৭ নিখরচায় নাগরিক পরিষেবা"
                  : language === "hi"
                  ? "भारत सरकार द्वारा संचालित नि:शुल्क नागरिक सेवाएं"
                  : "Government of India 24x7 Citizen Emergency Redressal"}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setHelplineModalOpen(false))}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>{language === "bn" ? "সাইবার অপরাধ সংক্রান্ত সতর্কতা:" : "Cyber Fraud Advisory:"}</strong>{" "}
              {language === "bn"
                ? "যদি আপনি ইউপিআই বা ব্যাঙ্কিং লিঙ্কে প্রতারণার শিকার হন, অবিলম্বে ১৯৩০ নম্বরে ফোন করুন। প্রথম ২৪ ঘণ্টার মধ্যে জানালে টাকা ফ্রিজ করা সম্ভব।"
                : "If you lost money via UPI, net banking, or fraudulent links, call 1930 immediately. Reporting within the golden hours increases the chances of freezing fraudulent transactions."}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {EMERGENCY_HELPLINES.map((item) => (
              <div
                key={item.number}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-[#142B49]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#142B49]">
                      {item.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">24x7 Toll-Free</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#142B49] mb-1">
                    {language === "bn"
                      ? item.bengaliName
                      : language === "hi"
                      ? item.hindiName
                      : item.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    {language === "bn" ? item.descBn : item.desc}
                  </p>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#142B49] text-white hover:bg-[#1E3E68] text-sm font-bold transition-all shadow-xs"
                >
                  <PhoneCall size={15} />
                  <span>Call {item.number}</span>
                </a>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              {language === "bn"
                ? "আইনি সেবা কর্তৃপক্ষ আইন, ১৯৮৭ এর ধারা ১২ এর অধীনে নিখরচায় সরকারি আইনি সহায়তার জন্য জেলা আইনি সেবা কোষে (DLSA) যোগাযোগ করতে পারেন।"
                : "For court filing assistance or Free Legal Aid under Section 12 of the Legal Services Authorities Act, you can also contact your District Court Legal Aid Cell (DLSA)."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => dispatch(setHelplineModalOpen(false))}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
