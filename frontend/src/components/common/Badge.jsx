import React from "react";

export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    navy: "bg-[#142B49]/10 text-[#142B49] border-[#142B49]/20 font-medium",
    gold: "bg-[#D69B45]/15 text-[#9C6819] border-[#D69B45]/30 font-medium",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    tenant: "bg-amber-50 text-amber-800 border-amber-200",
    labour: "bg-blue-50 text-blue-700 border-blue-200",
    consumer: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cyber: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}

