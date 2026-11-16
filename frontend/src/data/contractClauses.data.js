export const SAMPLE_CONTRACT_AUDITS = [
  {
    contractType: "Residential Leave & License / Rental Agreement",
    fileName: "Standard_Rental_Agreement_Bangalore.pdf",
    overallRisk: "HIGH",
    riskScore: 78,
    findingsSummary: "The agreement contains 3 severely one-sided clauses favoring the landlord, including forfeiture of deposit without cause, arbitrary rent escalations, and 24-hour unannounced entry.",
    clauses: [
      {
        id: "c1",
        clauseTitle: "Arbitrary Security Deposit Forfeiture Clause",
        originalText: "Clause 14: In the event of early termination by the Licensor or Licensee prior to 11 months, the entire security deposit of ₹1,00,000 shall stand automatically forfeited without any refund.",
        riskLevel: "HIGH",
        issueExplanation: "Under Section 74 of the Indian Contract Act, 1872 and Model Tenancy Act, forfeiture of security deposit as a penalty without proof of actual liquidated loss is legally void. A reasonable 1-month notice clause is standard.",
        recommendedRevision: "In the event of termination before 11 months, either party may give 30 days written notice. The security deposit shall be refunded in full within 15 days of vacation, subject only to actual utility dues."
      },
      {
        id: "c2",
        clauseTitle: "Landlord Unrestricted Entry Without Notice",
        originalText: "Clause 8: The Licensor or his agents may enter and inspect the premises at any hour of the day or night without prior notification to the Licensee.",
        riskLevel: "MEDIUM",
        issueExplanation: "Violates the tenant's right to peaceful and quiet enjoyment. Model Tenancy Act mandates at least 24 hours advance written notice before inspection during reasonable daytime hours (9 AM - 6 PM).",
        recommendedRevision: "The Licensor may inspect the premises by providing at least 24 hours advance written notice, between 9:00 AM and 6:00 PM on working days, in the presence of the Licensee."
      },
      {
        id: "c3",
        clauseTitle: "Structural Repair Shifted to Tenant",
        originalText: "Clause 11: All repairs, including structural seepage, roof leaks, plumbing mains, and electrical wiring failures shall be solely borne by the Tenant at their own cost.",
        riskLevel: "HIGH",
        issueExplanation: "Under Indian tenancy jurisprudence, structural maintenance and capital repairs are the mandatory responsibility of the property owner. Shifting structural liability is an unfair contract term.",
        recommendedRevision: "Minor day-to-day repairs up to ₹1,000 shall be borne by the Tenant. All structural repairs, major seepage, plumbing mains, and electrical panel replacements shall be executed promptly by the Landlord."
      }
    ]
  },
  {
    contractType: "Employment Offer Letter & Non-Disclosure Agreement",
    fileName: "Software_Engineer_Employment_Contract.pdf",
    overallRisk: "CRITICAL",
    riskScore: 88,
    findingsSummary: "Contains an unenforceable 2-year post-termination non-compete clause (void under Section 27 Indian Contract Act) and an unlawful 3-month salary forfeiture bond.",
    clauses: [
      {
        id: "e1",
        clauseTitle: "Post-Employment Non-Compete Restriction",
        originalText: "Clause 19: The Employee agrees that for a period of 24 months following departure, they shall not work directly or indirectly for any technology competitor across India.",
        riskLevel: "CRITICAL",
        issueExplanation: "Section 27 of the Indian Contract Act, 1872 explicitly renders every agreement in restraint of lawful profession, trade, or business void. The Supreme Court in Percept D'Mark v. Zaheer Khan upheld that post-employment non-compete covenants are completely unenforceable in India.",
        recommendedRevision: "Employee agrees not to disclose or misappropriate proprietary trade secrets and confidential client data. (Delete the 24-month post-employment non-compete as it is void ab initio)."
      },
      {
        id: "e2",
        clauseTitle: "Employment Bond with Arbitrary Liquidated Damages",
        originalText: "Clause 7: In case of resignation within 18 months, Employee must pay ₹3,00,000 as liquidated damages and forfeit all pending salary.",
        riskLevel: "HIGH",
        issueExplanation: "Employment bonds are only enforceable if the employer proves actual documented expenditure incurred solely on specialized training (Section 74 Indian Contract Act). Recovery beyond actual training costs is punitive and invalid.",
        recommendedRevision: "If the company incurs documented third-party certified training expenses, a prorated recovery may be agreed upon, capped strictly at the actual demonstrated costs."
      }
    ]
  }
];

