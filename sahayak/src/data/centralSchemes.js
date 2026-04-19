export const centralSchemes = [
  // --- AGRICULTURE ---
  {
    id: "CEN-AGRI-01",
    title: "PM-KISAN",
    category: "agriculture",
    benefit: "₹6,000 per year",
    eligibility: ["Landholding Farmers", "Valid Aadhaar", "Bank Account linked to Aadhaar"],
    docs: ["Aadhaar Card", "Land Records", "Bank Passbook"],
    reqs: { format: "PDF", size: "200kb" }
  },
  {
    id: "CEN-AGRI-02",
    title: "PM-KUSUM",
    category: "agriculture",
    benefit: "60% Subsidy for Solar Pumps",
    eligibility: ["Individual Farmers", "Cooperatives", "Panchayats"],
    docs: ["Aadhaar Card", "Land Possession Certificate", "NOC from Electricity Dept"],
    reqs: { format: "JPG", size: "500kb" }
  },

  // --- EDUCATION ---
  {
    id: "CEN-EDU-01",
    title: "PM-YASASVI",
    category: "education",
    benefit: "₹75,000 - ₹1,25,000 per year",
    eligibility: ["OBC/EBC/DNT students", "Class 9 or 11", "Income < ₹2.5 LPA"],
    docs: ["Aadhaar Card", "Income Certificate", "Caste Certificate", "Marksheet"],
    reqs: { format: "PDF", size: "500kb" }
  },
  {
    id: "CEN-EDU-02",
    title: "National Means-cum-Merit Scholarship",
    category: "education",
    benefit: "₹12,000 per year",
    eligibility: ["Class 9 students", "Score > 55% in Class 8", "Income < ₹3.5 LPA"],
    docs: ["Aadhaar Card", "Class 8 Marksheet", "Income Certificate"],
    reqs: { format: "PDF", size: "300kb" }
  },
  {
    id: "CEN-EDU-03",
    title: "Post-Matric Scholarship",
    category: "education",
    benefit: "Full Tuition Fee Waiver",
    eligibility: ["SC/ST Students", "Pursuing Higher Education", "Income < ₹2.5 LPA"],
    docs: ["Aadhaar Card", "Caste Certificate", "Fee Receipt", "Admission Letter"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- HEALTH ---
  {
    id: "CEN-HLTH-01",
    title: "Ayushman Bharat (PM-JAY)",
    category: "health",
    benefit: "₹5 Lakh health cover per family",
    eligibility: ["Low income families", "SECC Database listed", "No age limit"],
    docs: ["Aadhaar Card", "Ration Card", "PM Letter / E-card"],
    reqs: { format: "JPG", size: "200kb" }
  },
  {
    id: "CEN-HLTH-02",
    title: "PM Matru Vandana Yojana",
    category: "health",
    benefit: "₹5,000 for first child",
    eligibility: ["Pregnant Women", "Lactating Mothers", "First child only"],
    docs: ["Aadhaar Card", "MCP Card", "Bank Passbook"],
    reqs: { format: "PDF", size: "400kb" }
  },

  // --- HOUSING ---
  {
    id: "CEN-HOUS-01",
    title: "PM Awas Yojana (Gramin)",
    category: "housing",
    benefit: "₹1.2 Lakh for house construction",
    eligibility: ["Kutcha house owners", "Homeless families", "Low income"],
    docs: ["Aadhaar Card", "Job Card", "Bank Passbook", "Land Record"],
    reqs: { format: "JPG", size: "500kb" }
  },
  {
    id: "CEN-HOUS-02",
    title: "PM Awas Yojana (Urban)",
    category: "housing",
    benefit: "Credit Linked Subsidy (CLSS)",
    eligibility: ["EWS/LIG families", "Valid Aadhaar", "No pucca house anywhere"],
    docs: ["Aadhaar Card", "Income Certificate", "Affidavit of No Home"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- BUSINESS ---
  {
    id: "CEN-BIZ-01",
    title: "PM Mudra Yojana",
    category: "business",
    benefit: "Loan up to ₹10 Lakh without collateral",
    eligibility: ["Small business owners", "Startups", "Service sector units"],
    docs: ["Aadhaar Card", "Business Plan", "Address Proof", "Quotation for items"],
    reqs: { format: "PDF", size: "1mb" }
  },
  {
    id: "CEN-BIZ-02",
    title: "Stand Up India",
    category: "business",
    benefit: "₹10 Lakh to ₹1 Crore bank loan",
    eligibility: ["Women Entrepreneurs", "SC/ST Entrepreneurs", "Greenfield projects"],
    docs: ["Aadhaar Card", "Project Report", "Caste Certificate", "KYC Docs"],
    reqs: { format: "PDF", size: "2mb" }
  },

  // --- WOMEN ---
  {
    id: "CEN-WOM-01",
    title: "Ujjwala Yojana 2.0",
    category: "women",
    benefit: "Free LPG Connection + Refill",
    eligibility: ["Women (18+)", "BPL Category", "Migrant workers eligible"],
    docs: ["Aadhaar Card", "Ration Card", "BPL Certificate"],
    reqs: { format: "JPG", size: "300kb" }
  },
  {
    id: "CEN-WOM-02",
    title: "Mahila Samman Savings Certificate",
    category: "women",
    benefit: "7.5% Fixed Interest Rate",
    eligibility: ["Women/Girls", "No age limit", "Max deposit ₹2 Lakh"],
    docs: ["Aadhaar Card", "PAN Card", "KYC Form"],
    reqs: { format: "JPG", size: "200kb" }
  },

  // --- SOCIAL ---
  {
    id: "CEN-SOC-01",
    title: "Atal Pension Yojana",
    category: "social",
    benefit: "Guaranteed monthly pension ₹1000-₹5000",
    eligibility: ["Age 18-40 years", "Bank account holder", "Indian Citizen"],
    docs: ["Aadhaar Card", "Bank Passbook", "Mobile linked to Aadhaar"],
    reqs: { format: "PDF", size: "200kb" }
  },
  {
    id: "CEN-SOC-02",
    title: "PM Suraksha Bima Yojana",
    category: "social",
    benefit: "₹2 Lakh Accidental Death Cover",
    eligibility: ["Age 18-70 years", "Bank account holder", "Premium ₹20/year"],
    docs: ["Aadhaar Card", "Bank Passbook", "Nominee details"],
    reqs: { format: "PDF", size: "100kb" }
  },

  // --- SKILLS/EMPLOYMENT ---
  {
    id: "CEN-EMP-01",
    title: "PM Kaushal Vikas Yojana",
    category: "employment",
    benefit: "Skill training and certification",
    eligibility: ["Unemployed youth", "School/College dropouts", "Valid ID"],
    docs: ["Aadhaar Card", "Marksheet", "Voter ID", "Photo"],
    reqs: { format: "JPG", size: "500kb" }
  },
  {
    id: "CEN-EMP-02",
    title: "PM SVANidhi",
    category: "employment",
    benefit: "₹10,000 Working Capital Loan",
    eligibility: ["Street Vendors", "Peri-urban areas", "Certificate of Vending"],
    docs: ["Aadhaar Card", "Vending Certificate", "Voter ID"],
    reqs: { format: "PDF", size: "300kb" }
  },

  // --- BANKING ---
  {
    id: "CEN-BANK-01",
    title: "PM Jan Dhan Yojana",
    category: "banking",
    benefit: "Zero Balance Account + Overdraft",
    eligibility: ["Every Indian Citizen", "No prior account desired", "Age 10+"],
    docs: ["Aadhaar Card", "Ration Card", "Passport Photo"],
    reqs: { format: "JPG", size: "200kb" }
  },
  {
    id: "CEN-BANK-02",
    title: "PM Jeevan Jyoti Bima Yojana",
    category: "banking",
    benefit: "₹2 Lakh Life Insurance cover",
    eligibility: ["Age 18-50 years", "Bank account holder", "Premium ₹436/year"],
    docs: ["Aadhaar Card", "Bank Passbook", "Nominee ID"],
    reqs: { format: "PDF", size: "200kb" }
  },

  // --- SCIENCE/IT ---
  {
    id: "CEN-SCI-01",
    title: "Digital India Internship Scheme",
    category: "science",
    benefit: "₹10,000 Monthly Stipend",
    eligibility: ["Final year B.E/B.Tech", "Min 60% marks", "Indian Student"],
    docs: ["Aadhaar Card", "College Bonafide", "Current Semester Marksheet"],
    reqs: { format: "PDF", size: "500kb" }
  },
  {
    id: "CEN-SCI-02",
    title: "Inspire Awards - MANAK",
    category: "science",
    benefit: "₹10,000 for innovative ideas",
    eligibility: ["Students Class 6-10", "Innovation potential", "Nominated by school"],
    docs: ["Aadhaar Card", "School ID", "Idea Synopsis (PDF)"],
    reqs: { format: "PDF", size: "1mb" }
  },

  // --- SPORTS ---
  {
    id: "CEN-SPT-01",
    title: "Khelo India Scholarship",
    category: "sports",
    benefit: "₹5 Lakh annual scholarship",
    eligibility: ["Aged 8-18", "Talented in 20+ disciplines", "Top performers in Games"],
    docs: ["Aadhaar Card", "Sports Achievement Cert", "Birth Certificate"],
    reqs: { format: "PDF", size: "1mb" }
  },
  {
    id: "CEN-SPT-02",
    title: "Target Olympic Podium Scheme (TOPS)",
    category: "sports",
    benefit: "₹50,000 monthly out-of-pocket allowance",
    eligibility: ["Elite Athletes", "Olympic prospects", "International rank"],
    docs: ["Passport", "International Rank Proof", "Contract Form"],
    reqs: { format: "PDF", size: "2mb" }
  },

  // --- TRANSPORT ---
  {
    id: "CEN-TRN-01",
    title: "FAME-II Subsidy",
    category: "transport",
    benefit: "Subsidy for purchasing Electric Vehicles",
    eligibility: ["EV Buyers", "Valid Driving License", "GST Registered (for commercial)"],
    docs: ["Aadhaar Card", "Driving License", "Sales Invoice"],
    reqs: { format: "PDF", size: "500kb" }
  },
  {
    id: "CEN-TRN-02",
    title: "PM Gati Shakti Training",
    category: "transport",
    benefit: "Logistics sector certification",
    eligibility: ["Supply chain professionals", "Graduates", "Skill seekers"],
    docs: ["Aadhaar Card", "Degree Certificate", "Work Exp Proof"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- TOURISM ---
  {
    id: "CEN-TOU-01",
    title: "Swadesh Darshan Skill Training",
    category: "travel",
    benefit: "Hospitality sector certification",
    eligibility: ["Unemployed youth", "Interested in Tourism", "Class 10+"],
    docs: ["Aadhaar Card", "Class 10 Marksheet", "Residence Proof"],
    reqs: { format: "JPG", size: "300kb" }
  },
  {
    id: "CEN-TOU-02",
    title: "Incredible India Tourist Facilitator",
    category: "travel",
    benefit: "Government Guide License",
    eligibility: ["Age 18-40", "Graduate", "Fluent in English/Regional Lang"],
    docs: ["Aadhaar Card", "Degree Certificate", "Language proficiency doc"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- UTILITY ---
  {
    id: "CEN-UTL-01",
    title: "Saubhagya Yojana",
    category: "utility",
    benefit: "Free Electricity Connection",
    eligibility: ["BPL Households", "Non-electrified houses", "Valid ID"],
    docs: ["Aadhaar Card", "Ration Card", "Address Proof"],
    reqs: { format: "JPG", size: "300kb" }
  },
  {
    id: "CEN-UTL-02",
    title: "Swachh Bharat Mission (Gramin)",
    category: "utility",
    benefit: "₹12,000 for IHHL (Toilet) construction",
    eligibility: ["Rural Households", "No prior toilet", "Identified by Panchayat"],
    docs: ["Aadhaar Card", "Bank Passbook", "Panchayat Verification"],
    reqs: { format: "JPG", size: "400kb" }
  },

  // --- SAFETY ---
  {
    id: "CEN-SAF-01",
    title: "Cyber Safe India Training",
    category: "safety",
    benefit: "Cybersecurity Expert Certification",
    eligibility: ["Students/Professionals", "Indian Citizen", "Interest in IT Safety"],
    docs: ["Aadhaar Card", "ID Proof", "Educational Cert"],
    reqs: { format: "PDF", size: "500kb" }
  },
  {
    id: "CEN-SAF-02",
    title: "PM Scholarship for CAPF & AR",
    category: "safety",
    benefit: "₹3,000 monthly for boys, ₹3,500 for girls",
    eligibility: ["Wards of CAPF/Assam Rifles", "Pursuing Tech/Prof Ed", "Min 60% in Class 12"],
    docs: ["Aadhaar Card", "Service Certificate", "Class 12 Marksheet"],
    reqs: { format: "PDF", size: "1mb" }
  }
];
