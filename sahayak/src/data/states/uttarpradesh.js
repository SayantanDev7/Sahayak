export const uttarPradeshSchemes = [
  // --- EDUCATION ---
  {
    id: "UP-EDU-01",
    title: "UP Post-Matric Scholarship",
    category: "education",
    benefit: "Fee Reimbursement + Maintenance Allowance",
    eligibility: ["SC/ST/OBC/General categories", "Resident of UP", "Income < ₹2 LPA (Gen/OBC) or ₹2.5 LPA (SC/ST)"],
    docs: ["Aadhaar Card", "Income Certificate", "Caste Certificate", "Fee Receipt"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- HEALTH ---
  {
    id: "UP-HLTH-01",
    title: "UP Janani Suraksha Yojana",
    category: "health",
    benefit: "₹1,400 (Rural) / ₹1,000 (Urban) for delivery",
    eligibility: ["Pregnant Women", "Institutional delivery", "Low income"],
    docs: ["Aadhaar Card", "MCP Card", "Bank Passbook"],
    reqs: { format: "JPG", size: "300kb" }
  },

  // --- AGRICULTURE ---
  {
    id: "UP-AGRI-01",
    title: "UP Ganna (Sugarcane) Parchi System",
    category: "agriculture",
    benefit: "Direct sale of Sugarcane to Mills",
    eligibility: ["Sugarcane Farmers in UP", "Member of Cooperative Society"],
    docs: ["Aadhaar Card", "Ganna Calendar Copy", "Bank Account Details"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- WOMEN ---
  {
    id: "UP-WOM-01",
    title: "Kanya Sumangala Yojana",
    category: "women",
    benefit: "₹15,000 to ₹25,000 in stages",
    eligibility: ["Max 2 girls in family", "Resident of UP", "Income < ₹3 LPA"],
    docs: ["Aadhaar Card", "Birth Certificate", "Family Photo", "Income Certificate"],
    reqs: { format: "PDF", size: "1mb" }
  },

  // --- SOCIAL ---
  {
    id: "UP-SOC-01",
    title: "UP Widow Pension Scheme",
    category: "social",
    benefit: "₹1,000 Monthly Pension",
    eligibility: ["Widows aged 18-60", "Resident of UP", "Not re-married"],
    docs: ["Aadhaar Card", "Death Certificate of Husband", "Income Certificate"],
    reqs: { format: "PDF", size: "400kb" }
  },

  // --- BUSINESS ---
  {
    id: "UP-BIZ-01",
    title: "One District One Product (ODOP) Loan Scheme",
    category: "business",
    benefit: "Financial assistance for traditional crafts",
    eligibility: ["Artisans", "Small Units in ODOP clusters", "Resident of UP"],
    docs: ["Aadhaar Card", "Project Report", "Artisan ID Card"],
    reqs: { format: "PDF", size: "1mb" }
  },

  // --- EMPLOYMENT ---
  {
    id: "UP-EMP-01",
    title: "UP Berojgari Bhatta (Unemployment Allowance)",
    category: "employment",
    benefit: "₹1,000 to ₹1,500 monthly",
    eligibility: ["Unemployed youth (25-35 years)", "Class 10 Pass", "Income < ₹3 LPA"],
    docs: ["Aadhaar Card", "Education Certificates", "Employment Exchange Cert"],
    reqs: { format: "PDF", size: "500kb" }
  }
];
