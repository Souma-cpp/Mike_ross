import { LEGAL_DOMAINS } from "../data/legalDomains.data";
import { RIGHTS_EXPLANATIONS } from "../data/rightsExplanations.data";
import { PRECEDENTS_DATA } from "../data/precedents.data";
import { DOCUMENT_TEMPLATES } from "../data/documentTemplates.data";
import { SAMPLE_CONTRACT_AUDITS } from "../data/contractClauses.data";
import { VERIFIED_LAWYERS } from "../data/verifiedLawyers.data";

export const LegalMockService = {
  // 1. Classifies legal issue and builds complete citizen response
  classifyAndAnalyze: async (prompt, forcedDomain = "auto") => {
    // Artificial slight delay to simulate AI legal reasoning
    await new Promise((resolve) => setTimeout(resolve, 800));

    const text = (prompt || "").toLowerCase();
    let domain = forcedDomain;
    let templateKey;
    let customDomainTitle = "Indian Legal Jurisprudence & Citizen Remedy";

    // Multilingual keyword matching: English, Bengali (বাংলা), and Hindi
    if (!domain || domain === "auto") {
      if (
        text.includes("rent") || text.includes("tenant") || text.includes("landlord") || text.includes("deposit") || text.includes("evict") || text.includes("lease") ||
        text.includes("বাড়িওয়ালা") || text.includes("ভাড়া") || text.includes("ডিপোজিট") || text.includes("উচ্ছেদ") || text.includes("मकान मालिक")
      ) {
        domain = "tenant";
        templateKey = "tenant_deposit";
      } else if (
        text.includes("salary") || text.includes("wage") || text.includes("job") || text.includes("boss") || text.includes("employ") || text.includes("gratuity") || text.includes("terminated") || text.includes("pf") ||
        text.includes("বেতন") || text.includes("চাকরি") || text.includes("বরখাস্ত") || text.includes("গ্র্যাচুইটি") || text.includes("नौकरी")
      ) {
        domain = "labour";
        templateKey = "labour_wages";
      } else if (
        text.includes("upi") || text.includes("fraud") || text.includes("scam") || text.includes("hacked") || text.includes("cyber") || text.includes("phishing") || text.includes("bank") || text.includes("stolen money") || text.includes("apk") ||
        text.includes("জালিয়াতি") || text.includes("প্রতারণা") || text.includes("হ্যাক") || text.includes("ওটিপি") || text.includes("টাকা কাটা")
      ) {
        domain = "cyber";
        templateKey = "cyber_complaint";
      } else if (
        text.includes("product") || text.includes("seller") || text.includes("warranty") || text.includes("refund") || text.includes("e-commerce") || text.includes("flipkart") || text.includes("amazon") || text.includes("defective") ||
        text.includes("পণ্য") || text.includes("খারাপ") || text.includes("রিটার্ন") || text.includes("ফেরত") || text.includes("বিক্রেতা")
      ) {
        domain = "consumer";
        templateKey = "consumer_deficiency";
      } else if (
        text.includes("cheque") || text.includes("check") || text.includes("bounce") || text.includes("dishonor") || text.includes("138") ||
        text.includes("চেক") || text.includes("বাউন্স")
      ) {
        domain = "other";
        templateKey = "cheque_bounce";
        customDomainTitle = "Negotiable Instruments Act (Cheque Dishonor / চেক বাউন্স)";
      } else if (
        text.includes("rti") || text.includes("information") || text.includes("tender") || text.includes("officer") || text.includes("government record") ||
        text.includes("আরটিআই") || text.includes("তথ্য")
      ) {
        domain = "other";
        templateKey = "rti_application";
        customDomainTitle = "Right to Information (RTI Act, 2005 / তথ্য অধিকার)";
      } else {
        domain = "other";
        templateKey = "general_legal_notice";
        customDomainTitle = "General Civil & Criminal Grievance";
      }
    } else {
      if (domain === "labour") templateKey = "labour_wages";
      else if (domain === "tenant") templateKey = "tenant_deposit";
      else if (domain === "consumer") templateKey = "consumer_deficiency";
      else if (domain === "cyber") templateKey = "cyber_complaint";
      else templateKey = "general_legal_notice";
    }

    const domainMeta = LEGAL_DOMAINS.find((d) => d.id === domain) || LEGAL_DOMAINS[4];
    
    // Pick suitable rights
    let rights = RIGHTS_EXPLANATIONS[domain];
    if (templateKey === "cheque_bounce") rights = RIGHTS_EXPLANATIONS.cheque;
    else if (templateKey === "rti_application") rights = RIGHTS_EXPLANATIONS.rti;
    else if (!rights) rights = RIGHTS_EXPLANATIONS.other;

    // Pick suitable precedents
    let precedents = PRECEDENTS_DATA.filter((p) => p.domain === domain);
    if (!precedents || precedents.length === 0) {
      precedents = PRECEDENTS_DATA.slice(0, 2);
    }

    const baseTemplate = DOCUMENT_TEMPLATES[templateKey] || DOCUMENT_TEMPLATES.general_legal_notice;

    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    let draftContent = baseTemplate.body
      .replace(/\[Current Date\]/g, today)
      .replace(/\[Date\]/g, today);

    // Formulate structured Markdown legal assessment
    const answerMarkdown = `### ⚖️ Legal Assessment: ${customDomainTitle || domainMeta.name}

Based on Indian jurisprudence, statutory covenants, and the specific facts described in your inquiry:

#### 1. Core Statutory Rights & Remedies (নাগরিক অধিকার ও আইনি প্রতিকার)
${rights.map((r) => `* **${r.title}** (${r.law})\n  ${r.summary}\n  *Actionable Remedy*: \`${r.remedy}\``).join("\n\n")}

#### 2. Authoritative Court Precedents (আদালতের নজির)
${precedents.slice(0, 2).map((p) => `> **${p.caseTitle}** (*${p.court}, ${p.year}*)\n> **Principle**: ${p.principle}\n> Citation: \`${p.citation}\``).join("\n\n")}

#### 3. Strategic Action Plan for Citizens (পদক্ষেপ পরিকল্পনা)
1. **Serve Written Notice (আইনি নোটিশ)**: In Indian civil and criminal jurisprudence, issuing a written legal demand triggers statutory liability, evidentiary trail, and interest calculation. The **${baseTemplate.title}** drafted below is ready for your case.
2. **Documentary Trail (প্রমাণ সংরক্ষণ)**: Preserve all transaction memos, contracts, emails, and timestamped communications.
3. **Escalation & Free Legal Aid (নিখরচায় আইনি সাহায্য)**: If the opposing party fails to resolve within 15 days, you may institute formal proceedings or consult your District Legal Services Authority (DLSA) for **Free Legal Aid under Section 12** (Call 15100).
`;

    return {
      domain,
      domainMeta,
      rights,
      precedents,
      answer: answerMarkdown,
      draftNotice: {
        title: baseTemplate.title,
        subject: baseTemplate.subject,
        content: draftContent,
        domain
      }
    };
  },

  // 2. Search precedents across Indian courts
  searchPrecedents: (query = "", domainFilter = "all") => {
    let list = PRECEDENTS_DATA;
    if (domainFilter && domainFilter !== "all") {
      list = list.filter((p) => p.domain === domainFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.caseTitle.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.principle.toLowerCase().includes(q) ||
          p.court.toLowerCase().includes(q)
      );
    }
    return list;
  },

  // 3. Contract Intelligence Scanner
  getContractAudit: (type = "rental") => {
    if (type === "employment") {
      return SAMPLE_CONTRACT_AUDITS[1];
    }
    return SAMPLE_CONTRACT_AUDITS[0];
  },

  // 4. Free Legal Aid / Lawyer Directory
  getLawyers: (filterCity = "all", legalAidOnly = false) => {
    let list = VERIFIED_LAWYERS;
    if (filterCity && filterCity !== "all") {
      list = list.filter((l) => l.city.toLowerCase() === filterCity.toLowerCase());
    }
    if (legalAidOnly) {
      list = list.filter((l) => l.freeLegalAidEligible);
    }
    return list;
  }
};
