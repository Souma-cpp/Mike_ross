export const LEGAL_DOMAINS = [
  {
    id: "labour",
    name: "Labour & Employment Rights",
    nameHi: "श्रम और रोजगार अधिकार",
    nameBn: "শ্রম ও কর্মসংস্থান অধিকার",
    shortDesc: "Wages, wrongful dismissal, PF/ESI, overtime, and workplace harassment.",
    shortDescHi: "वेतन, अनुचित बर्खास्तगी, पीएफ/ईएसआई और कार्यस्थल अधिकार।",
    shortDescBn: "বকেয়া বেতন, অন্যায় বরখাস্ত, পিএফ/গ্র্যাচুইটি এবং কর্মক্ষেত্রের অধিকার।",
    iconName: "Briefcase",
    color: "#1E3E68",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    keyActs: [
      "Payment of Wages Act, 1936",
      "Industrial Relations Code, 2020",
      "Employees' Provident Funds Act, 1952",
      "Maternity Benefit Act, 1961"
    ],
    samplePrompts: [
      "My employer terminated me without 30-day notice and withheld my final salary.",
      "How do I claim my unpaid gratuity after working for 6 years?",
      "Can my employer force me to work overtime without additional pay?"
    ],
    samplePromptsBn: [
      "আমার কোম্পানি ৩০ দিনের নোটিশ ছাড়াই আমাকে বরখাস্ত করেছে এবং বকেয়া বেতন আটকে রেখেছে।",
      "৬ বছর কাজ করার পর বকেয়া গ্র্যাচুইটি কীভাবে দাবি করব?",
      "কোম্পানি কি অতিরিক্ত বেতন ছাড়া ওভারটাইম করাতে পারে?"
    ]
  },
  {
    id: "tenant",
    name: "Tenant & Rental Rights",
    nameHi: "किरायेदार और आवास अधिकार",
    nameBn: "ভাড়াটিয়া ও আবাসন অধিকার",
    shortDesc: "Security deposit refund, illegal eviction, lease terms, and repairs.",
    shortDescHi: "सिक्योरिटी डिपॉजिट वापसी, अवैध बेदखली, लीज नियम और मरम्मत।",
    shortDescBn: "সিকিউরিটি ডিপোজিট ফেরত, বেআইনি উচ্ছেদ, ভাড়ার চুক্তি এবং মেরামত।",
    iconName: "Home",
    color: "#D69B45",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    keyActs: [
      "Model Tenancy Act, 2021",
      "Transfer of Property Act, 1882 (Sec 106)",
      "State Rent Control Acts"
    ],
    samplePrompts: [
      "My landlord is refusing to return my security deposit of ₹75,000 without any damage.",
      "Landlord sent a 3-day WhatsApp eviction notice without court order.",
      "Owner disconnected electricity and water supply to force me out."
    ],
    samplePromptsBn: [
      "বাড়িওয়ালা কোনো ক্ষতি ছাড়াই আমার ₹৭৫,০০০ টাকার সিকিউরিটি ডিপোজিট ফেরত দিতে অস্বীকার করছেন।",
      "আদালতের নির্দেশ ছাড়াই বাড়িওয়ালা হোয়াটসঅ্যাপে ৩ দিনের উচ্ছেদ নোটিশ পাঠিয়েছেন।",
      "জোর করে বের করার জন্য মালিক জল ও বিদ্যুতের সংযোগ কেটে দিয়েছেন।"
    ]
  },
  {
    id: "consumer",
    name: "Consumer Protection",
    nameHi: "उपभोक्ता संरक्षण अधिकार",
    nameBn: "ভোক্তা ও ক্রেতা সুরক্ষা অধিকার",
    shortDesc: "Defective goods, e-commerce fraud, deficient services, and misleading ads.",
    shortDescHi: "दोषपूर्ण उत्पाद, ई-कॉमर्स धोखाधड़ी, सेवा में कमी और भ्रामक विज्ञापन।",
    shortDescBn: "ত্রুটিযুক্ত পণ্য, ই-কমার্স প্রতারণা, সেবায় ঘাটতি এবং বিভ্রান্তিকর বিজ্ঞাপন।",
    iconName: "ShoppingBag",
    color: "#0D9488",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    keyActs: [
      "Consumer Protection Act, 2019 (CPA)",
      "Consumer Protection (E-Commerce) Rules, 2020",
      "Central Consumer Protection Authority (CCPA) Guidelines"
    ],
    samplePrompts: [
      "I received a fake smartphone from an e-commerce platform and return was rejected.",
      "Airlines cancelled my flight without refund and won't respond.",
      "Hospital charged ₹50,000 above the agreed package tariff."
    ],
    samplePromptsBn: [
      "একটি ই-কমার্স সাইট থেকে নকল স্মার্টফোন পেয়েছি এবং রিটার্ন বাতিল করা হয়েছে।",
      "এয়ারলাইন্স কোনো টাকা ফেরত না দিয়ে ফ্লাইট বাতিল করেছে।",
      "হাসপাতাল চুক্তিবদ্ধ মূল্যের চেয়ে ₹৫০,০০০ টাকা অতিরিক্ত বিল নিয়েছে।"
    ]
  },
  {
    id: "cyber",
    name: "Cyber Crime & Online Fraud",
    nameHi: "साइबर अपराध और डिजिटल सुरक्षा",
    nameBn: "সাইবার অপরাধ ও অনলাইন জালিয়াতি",
    shortDesc: "UPI scams, identity theft, phishing, unauthorized access, and cyber harassment.",
    shortDescHi: "यूपीआई घोटाला, पहचान चोरी, फिशिंग और वित्तीय धोखाधड़ी।",
    shortDescBn: "ইউপিআই স্ক্যাম, পরিচয় চুরি, ফিশিং এবং অনলাইন আর্থিক প্রতারণা।",
    iconName: "ShieldAlert",
    color: "#DC2626",
    badgeBg: "bg-red-50 text-red-700 border-red-200",
    keyActs: [
      "Information Technology Act, 2000 (Sec 43, 66C, 66D)",
      "Bharatiya Nyaya Sanhita, 2023 (Cyber Cheating)",
      "National Cyber Crime Reporting Portal (1930 Helpline)"
    ],
    samplePrompts: [
      "I lost ₹45,000 in an electricity bill phishing link via WhatsApp UPI request.",
      "Someone created a fake Instagram profile using my personal photos and phone number.",
      "My credit card was debited for international transactions without OTP."
    ],
    samplePromptsBn: [
      "হোয়াটসঅ্যাপে বিদ্যুতের বিলের ভুয়ো লিঙ্কে ক্লিক করে আমার ₹৪৫,০০০ টাকা ইউপিআই থেকে কেটে নিয়েছে।",
      "আমার ছবি ও ফোন নম্বর ব্যবহার করে কেউ একটি ভুয়ো ইনস্টাগ্রাম প্রোফাইল তৈরি করেছে।",
      "কোনো ওটিপি ছাড়াই ক্রেডিট কার্ড থেকে আন্তর্জাতিক লেনদেন হয়ে গেছে।"
    ]
  },
  {
    id: "other",
    name: "Other Legal Matters (Property, RTI, Cheque, Family)",
    nameHi: "अन्य कानूनी मामले (संपत्ति, आरटीआई, चेक बाउंस, पारिवारिक)",
    nameBn: "অন্যান্য আইনি বিষয় (সম্পত্তি, আরটিআই, চেক বাউন্স, পারিবারিক)",
    shortDesc: "Cheque bounce (Sec 138), RTI petitions, property disputes, RERA, and police grievances.",
    shortDescHi: "चेक बाउंस (धारा 138), आरटीआई आवेदन, संपत्ति विवाद, रेरा और पुलिस शिकायतें।",
    shortDescBn: "চেক বাউন্স (ধারা ১৩৮), আরটিআই আবেদন, সম্পত্তি বিবাদ, রেরা ও পুলিশি অভিযোগ।",
    iconName: "Scale",
    color: "#6366F1",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    keyActs: [
      "Negotiable Instruments Act, 1881 (Sec 138)",
      "Right to Information Act, 2005",
      "Real Estate (Regulation and Development) Act, 2016 (RERA)",
      "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS / CrPC)"
    ],
    samplePrompts: [
      "A client issued a cheque of ₹1,50,000 that bounced due to insufficient funds.",
      "How do I file an RTI application to check status of a government tender / road work?",
      "Builder delayed possession of my flat by 2 years beyond the RERA agreement date."
    ],
    samplePromptsBn: [
      "একজন ব্যবসায়িক ক্লায়েন্টের দেওয়া ₹১,৫০,০০০ টাকার চেক অ্যাকাউন্টে টাকা না থাকায় বাউন্স করেছে।",
      "সরকারি রাস্তার কাজের বিবরণ ও টেন্ডার ফাইলের তথ্য জানতে কীভাবে আরটিআই করব?",
      "রেরা চুক্তির তারিখের চেয়ে বিল্ডার ফ্ল্যাট হস্তান্তরে ২ বছর অযথা দেরি করেছে।"
    ]
  }
];

export const EMERGENCY_HELPLINES = [
  {
    number: "1930",
    name: "National Cyber Crime Reporting",
    hindiName: "राष्ट्रीय साइबर अपराध हेल्पलाइन",
    bengaliName: "জাতীয় সাইবার ক্রাইম হেল্পলাইন",
    desc: "Call immediately within golden hours (24h) to freeze fraudulent bank/UPI transactions.",
    descBn: "জালিয়াতি হওয়া টাকা ব্যাঙ্ক অ্যাকাউন্টে ফ্রিজ করতে অবিলম্বে ২৪ ঘণ্টার মধ্যে ফোন করুন।",
    badge: "Immediate Financial Relief",
    color: "bg-red-600 text-white"
  },
  {
    number: "15100",
    name: "NALSA Free Legal Aid Helpline",
    hindiName: "नालसा मुफ्त कानूनी सहायता",
    bengaliName: "নালসা বিনামূল্যে আইনি সহায়তা",
    desc: "24x7 toll-free legal aid by National Legal Services Authority for eligible citizens.",
    descBn: "সুপ্রিম কোর্ট ও জাতীয় আইনি সেবা কর্তৃপক্ষ কর্তৃক দরিদ্র নাগরিক ও মহিলাদের জন্য নিখরচায় আইনজীবী।",
    badge: "Free Legal Aid",
    color: "bg-[#142B49] text-white"
  },
  {
    number: "14416",
    name: "Tele-Law Citizen Advice",
    hindiName: "टेली-लॉ कानूनी सलाह",
    bengaliName: "টেলি-ল নাগরিক আইনি পরামর্শ",
    desc: "Ministry of Law & Justice initiative connecting citizens with Panel Advocates at CSC centers.",
    descBn: "কেন্দ্রীয় আইন মন্ত্রকের উদ্যোগে প্যানেল আইনজীবীদের সাথে বিনামূল্যে সরাসরি পরামর্শ।",
    badge: "Govt of India",
    color: "bg-amber-600 text-white"
  },
  {
    number: "1915",
    name: "National Consumer Helpline (NCH)",
    hindiName: "राष्ट्रीय उपभोक्ता हेल्पलाइन",
    bengaliName: "জাতীয় উপভোক্তা হেল্পলাইন",
    desc: "Lodge instant complaints against brands, e-commerce sellers, and warranty defaults.",
    descBn: "ই-কমার্স প্রতারণা ও পণ্য ত্রুটির বিরুদ্ধে সরাসরি সরকারি অভিযোগ দায়ের করুন।",
    badge: "Consumer Redressal",
    color: "bg-emerald-600 text-white"
  }
];
