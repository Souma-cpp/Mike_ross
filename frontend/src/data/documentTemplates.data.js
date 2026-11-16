export const DOCUMENT_TEMPLATES = {
  tenant_deposit: {
    title: "Legal Notice for Refund of Security Deposit",
    domain: "tenant",
    subject: "LEGAL NOTICE UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882 DEMANDING IMMEDIATE REFUND OF SECURITY DEPOSIT WITH INTEREST",
    body: `To,
[Landlord/Owner Name]
Residing at: [Landlord Address]
Contact No: [Landlord Mobile]

Sir/Madam,

Under instructions from and on behalf of my client/citizen, [Tenant Name], residing at [Tenant Current Address], I hereby serve upon you this formal Legal Notice:

1. That my client had entered into a Tenancy/Leave and License Agreement dated [Agreement Date] in respect of your residential premises situated at [Rented Premises Address], at a monthly rental of ₹[Monthly Rent].

2. That at the time of commencement of the tenancy, my client had paid to you an amount of ₹[Deposit Amount] (Rupees [Deposit in Words] only) towards interest-free refundable Security Deposit vide Bank Transfer/Cheque No. [Transaction Details].

3. That as per the terms of tenancy, my client duly served a 30-day notice on [Notice Date] intimating their intention to vacate the premises on [Vacation Date], and duly handed over vacant and peaceful physical possession of the said premises to you on [Handover Date].

4. That upon inspection conducted in your presence, the premises was found in clean, undamaged, and tenantable condition with no pending electricity, water, or maintenance dues.

5. That despite repeatedly contacting you over phone and written reminders dated [Reminder Dates], you have unlawfully, maliciously, and without any justifiable reason failed to refund the security deposit of ₹[Deposit Amount], thereby committing criminal breach of trust (Section 316 of Bharatiya Nyaya Sanhita, 2023 / Section 406 IPC) and unlawful enrichment.

I THEREFORE CALL UPON YOU to pay to my client the full security deposit sum of ₹[Deposit Amount] along with interest @ 18% per annum from [Handover Date] until actual realization, within 15 (FIFTEEN) DAYS of the receipt of this Notice.

Failing compliance, my client has given me strict instructions to initiate appropriate civil proceedings for recovery with costs, as well as criminal proceedings before the competent jurisdictional Magistrate, holding you solely liable for all legal expenses and consequences arising therefrom.

A copy of this notice is retained in my office for record and further legal proceedings.

Yours faithfully,

___________________________
[Advocate / Citizen Name]
Enrollment No: [Bar Enrollment / Citizen ID]
Date: [Current Date]
Place: [City, State]`
  },

  labour_wages: {
    title: "Demand Notice for Recovery of Unpaid Wages & Gratuity",
    domain: "labour",
    subject: "DEMAND NOTICE UNDER PAYMENT OF WAGES ACT, 1936 & INDUSTRIAL RELATIONS CODE DEMANDING IMMEDIATE DISBURSEMENT OF PENDING DUES",
    body: `To,
The Managing Director / Human Resources,
[Company/Employer Legal Entity Name]
Registered Office: [Company Address]
CIN / Reg No: [Company Reg No]

Subject: Demand Notice for Unpaid Salary, Severance Compensation, and Gratuity for [Employee Name] (Emp ID: [Employee ID])

Sir/Madam,

Under instructions from my client, [Employee Name], former [Designation] in your organization from [Joining Date] to [Relieving Date], I state as follows:

1. That my client rendered continuous, diligent, and blemish-free service to your organization for a period of [Years of Service] years.

2. That on [Termination/Resignation Date], the employment was abruptly brought to an end without paying the earned salary for the months of [Unpaid Months], totaling ₹[Unpaid Salary Amount].

3. That as per the Payment of Wages Act, 1936, an employer is statutorily mandated to disburse all pending wages before the expiry of the 7th/10th day. Withholding hard-earned wages is a punishable offense under Indian labour law.

4. That my client is also legally entitled to Gratuity under the Payment of Gratuity Act, 1972 amounting to ₹[Gratuity Amount], along with encashment of [Leave Days] accumulated paid leaves.

5. TOTAL OUTSTANDING DUES:
   a) Unpaid Salary: ₹[Unpaid Salary Amount]
   b) Notice Pay (in lieu of 30 days): ₹[Notice Pay Amount]
   c) Statutory Gratuity: ₹[Gratuity Amount]
   -------------------------------------------------
   TOTAL CLAIM: ₹[Total Claim Amount]

YOU ARE HEREBY CALLED UPON to pay the total outstanding sum of ₹[Total Claim Amount] to my client's designated bank account within 15 (FIFTEEN) DAYS of receipt of this notice.

If you fail to remit the dues within the stipulated timeframe, my client shall proceed to file a formal claim petition before the Controlling Authority under the Payment of Wages Act and the Hon'ble Labour Court, claiming 18% penal interest and damages for mental agony.

Yours sincerely,

___________________________
[Employee / Authorizing Representative]
Date: [Current Date]
Place: [City, State]`
  },

  consumer_deficiency: {
    title: "Pre-Litigation Consumer Notice for Defective Goods / Services",
    domain: "consumer",
    subject: "LEGAL NOTICE UNDER SECTION 35 OF CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE & UNFAIR TRADE PRACTICE",
    body: `To,
[Company Name / Customer Grievance Officer]
[Corporate Office Address]
Email: [Company Support Email]

Subject: Formal Notice regarding Defective Product [Product Name & Model] / Invoice No: [Invoice Number]

Sir/Madam,

Please take notice that I, [Consumer Name], resident of [Consumer Address], purchased [Product Name / Description] from your authorized dealership / platform on [Purchase Date] against Tax Invoice No: [Invoice Number] for a total consideration of ₹[Amount Paid].

1. That within [Days/Months] of normal intended use, the product developed severe manufacturing defects, namely: [Description of Defect/Failure].

2. That the product was handed over to your authorized service center under Job Sheet No: [Job Sheet Number] on [Date]. Despite retaining the product for over [Days at Center] days, the defect remains unresolved and your service personnel have failed to restore the product to functional state.

3. That your refusal to replace the defective unit or issue a full refund constitutes a blatant "Deficiency in Service" under Section 2(11) and an "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.

I HEREBY CALL UPON YOU to execute either of the following remedies within 15 (FIFTEEN) DAYS of this notice:
a) Provide an immediate full refund of ₹[Amount Paid] with interest @ 12% p.a., OR
b) Replace the defective unit with a brand new, sealed, defect-free equivalent product, AND
c) Pay ₹[Compensation Amount] towards compensation for mental agony, distress, and conveyance expenses.

TAKE NOTE that if you fail to remedy this grievance, a formal complaint will be instituted before the District Consumer Disputes Redressal Commission (DCDRC) via the e-Daakhil portal, claiming the full value, penal damages, and litigation costs.

[Consumer Signature / Name]
Mobile: [Consumer Mobile]
Date: [Current Date]`
  },

  cyber_complaint: {
    title: "Formal Police Complaint for Financial Cyber Fraud",
    domain: "cyber",
    subject: "COMPLAINT UNDER SECTIONS 43, 66C, 66D OF THE INFORMATION TECHNOLOGY ACT, 2000 & SECTION 318 BNS FOR CYBER FINANCIAL CHEATING",
    body: `To,
The Station House Officer / Cyber Crime Police Station,
[City / District Cyber Police Station Address]

Subject: Complaint regarding unauthorized debit / fraudulent UPI transfer of ₹[Defrauded Amount] from Bank Account [Account No]

Respected Officer,

I, [Complainant Name], residing at [Complainant Address], Mobile No: [Complainant Mobile], wish to lodge a formal complaint regarding a cyber financial fraud committed against me:

1. INCIDENT DETAILS:
   - Date & Time of Occurrence: [Date & Exact Time]
   - Victim's Bank & Account: [Bank Name], Account No: [Account No]
   - Transaction ID / UPI Reference (UTR): [UTR / Ref Numbers]
   - Total Amount Defrauded: ₹[Defrauded Amount]
   - Fraudster's Mobile / VPA / Account: [Fraudster Details]
   - National Cyber Crime Portal Acknowledgement No: [1930 / NCRP Ticket No]

2. BRIEF MODUS OPERANDI:
   On [Date], the undersigned received a suspicious SMS/call purporting to be from [Electricity Dept / Bank / Courier]. The fraudster induced the undersigned to click an APK link / initiate a remote screen-share under the false pretense of [Bill Update / KYC / Courier Delivery]. Subsequently, unauthorized debits totaling ₹[Defrauded Amount] were siphoned off without consent.

3. IMMEDIATE MITIGATION UNDERTAKEN:
   The undersigned immediately reported the fraud on the National Cyber Crime Helpline '1930' within [Number of hours] hours (Golden Hour window) and received Acknowledgement No: [NCRP Ref]. The beneficiary account belongs to [Beneficiary Bank if known].

4. PRAYER:
   It is respectfully requested that:
   a) A formal Zero FIR / Cyber Complaint be registered under Sections 43, 66C, 66D of the IT Act, 2000 and Section 318 of Bharatiya Nyaya Sanhita, 2023.
   b) A formal Section 91 CrPC / BNSS notice be issued to the nodal officer of [Beneficiary Bank] to immediately freeze the recipient mule account and initiate chargeback.
   c) The fraudsters be tracked through CDR/IPDR analysis and brought to justice.

Enclosed herewith:
1. Bank Account Statement showing unauthorized debit entries.
2. Screenshots of fraudulent SMS, WhatsApp chat, and payment confirmations.
3. NCRP 1930 complaint acknowledgement slip.

Yours faithfully,

___________________________
[Complainant Name]
Date: [Current Date]
Place: [City, State]`
  },

  cheque_bounce: {
    title: "Statutory Demand Notice for Cheque Dishonor (Sec 138 NI Act)",
    domain: "other",
    subject: "STATUTORY DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 FOR DISHONOUR OF CHEQUE",
    body: `To,
[Drawer / Accused Name]
Residing at: [Drawer Address]
Contact No: [Drawer Mobile]

Sir/Madam,

Under instructions from my client, [Payee / Complainant Name], residing at [Payee Address], I hereby serve upon you this mandatory Statutory Demand Notice under Section 138 of the Negotiable Instruments Act, 1881:

1. That in discharge of your legally enforceable debt/liability towards my client for [Reason for Payment / Loan / Invoice], you had issued Cheque No: [Cheque Number] dated [Cheque Date] for an amount of ₹[Cheque Amount] drawn on your bank account at [Drawer Bank Name & Branch].

2. That my client presented the said cheque for encashment through their bankers [Payee Bank Name]. However, the said cheque was returned unpaid and dishonoured by the bank vide Return Memo dated [Memo Date] with the official remark: "FUNDS INSUFFICIENT" / "EXCEEDS ARRANGEMENT".

3. That the dishonour of the said cheque clearly establishes that you issued it with full knowledge that sufficient funds were not available in your account, thereby committing an offense punishable under Section 138 of the Negotiable Instruments Act, 1881, as well as cheating under Section 318 of Bharatiya Nyaya Sanhita, 2023.

I HEREBY CALL UPON YOU to make payment of the cheque amount of ₹[Cheque Amount] (Rupees [Amount in Words] only) to my client within 15 (FIFTEEN) DAYS of the receipt of this statutory notice.

TAKE NOTE that if you fail to remit the said amount within the stipulated statutory period of 15 days, my client shall be constrained to institute criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881 before the Hon'ble Metropolitan Magistrate / Judicial Magistrate First Class, wherein you shall be liable to be punished with imprisonment for a term which may extend to two (2) years, or with fine which may extend to twice the amount of the cheque, or with both, along with all litigation costs.

Yours faithfully,

___________________________
[Advocate for Complainant]
Enrollment No: [Bar Council Enrollment]
Date: [Current Date]
Place: [City, State]`
  },

  rti_application: {
    title: "RTI Application under Section 6(1) of RTI Act, 2005",
    domain: "other",
    subject: "APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005",
    body: `To,
The Central / State Public Information Officer (CPIO / SPIO),
[Department / Public Authority Name]
[Government Office Address]

Subject: Request for Information under Section 6(1) of Right to Information Act, 2005 regarding [Subject Matter / Tender / Work / File]

1. Full Name of Applicant: [Applicant Citizen Name]
2. Address for Correspondence: [Applicant Postal Address]
3. Contact Details: Phone: [Mobile No] | Email: [Email Address]
4. Citizenship: Citizen of India

5. PARTICULARS OF INFORMATION SOUGHT:
   a) Please provide certified copies of file notings, approvals, and work orders related to [Project / Road / Tender / Application No].
   b) Please specify the total sanctioned budget, funds disbursed till date, and the designated contractor details.
   c) Please provide the scheduled completion date as per contract and reasons recorded for delay, if any.
   d) Certified copies of inspection reports and quality compliance certificates submitted by engineers.

6. Period to which the information relates: [Month/Year to Month/Year]

7. Application Fee Details:
   Enclosed herewith IPO / Demand Draft / Court Fee Stamp No: [Postal Order No] dated [Date] for ₹10/- (Rupees Ten only) towards statutory application fee.

8. Mandatory 30-Day Timeline:
   As per Section 7(1) of the RTI Act, 2005, the requested information may kindly be furnished within 30 days of the receipt of this application.

Date: [Current Date]
Place: [City, State]

___________________________
[Signature of Citizen Applicant]`
  },

  general_legal_notice: {
    title: "Formal Citizen Legal Demand Notice & Representation",
    domain: "other",
    subject: "FORMAL LEGAL NOTICE & STATUTORY REPRESENTATION UNDER INDIAN JURISPRUDENCE",
    body: `To,
[Opposing Party Name]
Address: [Opposing Party Address]

Subject: Formal Notice demanding resolution of legal dispute regarding [Dispute Nature]

Sir/Madam,

Under instructions from my client, [Citizen Name], residing at [Citizen Address], I hereby address this formal Legal Notice to you:

1. That my client has a bona fide legal claim and grievance against you arising from [Summary of Facts and Events leading to dispute].

2. That your acts, defaults, and omissions violate established rights guaranteed under Indian law, including the principles of natural justice and statutory covenants.

3. That despite verbal requests and written communications, you have failed and neglected to fulfill your lawful obligation towards my client.

I HEREBY CALL UPON YOU to resolve the said grievance, cease and desist from unlawful interference, and remit the claimed sum of ₹[Claimed Amount] within 15 (FIFTEEN) DAYS of receipt hereof.

Failing which, my client reserves all rights to initiate appropriate civil and criminal proceedings before the competent court of law at your sole risk and costs.

Yours faithfully,

___________________________
[Advocate / Authorized Signatory]
Date: [Current Date]
Place: [City, State]`
  }
};
