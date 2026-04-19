export const maharashtraSchemes = [
  // --- EDUCATION ---
  {
    id: "MH-EDU-01",
    title: "Rajarshi Chhatrapati Shahu Maharaj Fee Reimbursement",
    category: "education",
    benefit: "50% - 100% Tuition Fee Reimbursement",
    eligibility: ["EBC Category students", "Professional Courses", "Income < ₹8 LPA"],
    docs: ["Aadhaar Card", "Income Certificate", "Caste Certificate", "Admission Receipt"],
    reqs: { format: "PDF", size: "1mb" }
  },
  {
    id: "MH-EDU-02",
    title: "Punjabarao Deshmukh Hostel Maintenance Allowance",
    category: "education",
    benefit: "₹2,000 to ₹3,000 monthly allowance",
    eligibility: ["Children of registered laborers", "Registered in professional courses", "Staying in Hostels"],
    docs: ["Aadhaar Card", "Hostel Receipt", "Laborer Registration Card"],
    reqs: { format: "PDF", size: "500kb" }
  },

  // --- AGRICULTURE ---
  {
    id: "MH-AGRI-01",
    title: "Namo Shetkari Mahasanman Nidhi",
    category: "agriculture",
    benefit: "₹6,000 per year (Additional to PM-KISAN)",
    eligibility: ["PM-KISAN beneficiaries", "Maharashtra Resident", "Small/Marginal Farmers"],
    docs: ["Aadhaar Card", "Land Records", "Bank Passbook"],
    reqs: { format: "PDF", size: "300kb" }
  },

  // --- HEALTH ---
  {
    id: "MH-HLTH-01",
    title: "Mahatma Jyotirao Phule Jan Arogya Yojana",
    category: "health",
    benefit: "₹1.5 Lakh to ₹5 Lakh cover per family",
    eligibility: ["Ration Card holders (Yellow/Orange)", "All Families in specific districts"],
    docs: ["Aadhaar Card", "Ration Card", "Identity Proof"],
    reqs: { format: "JPG", size: "500kb" }
  },

  // --- WOMEN ---
  {
    id: "MH-WOM-01",
    title: "Majhi Ladki Bahin Yojana",
    category: "women",
    benefit: "₹1,500 Monthly allowance",
    eligibility: ["Women aged 21-65", "Income < ₹2.5 LPA", "Resident of Maharashtra"],
    docs: ["Aadhaar Card", "Income Certificate", "Domicile Certificate", "Ration Card"],
    reqs: { format: "PDF", size: "1mb" }
  },

  // --- SOCIAL ---
  {
    id: "MH-SOC-01",
    title: "Sanjay Gandhi Niradhar Anudan Yojana",
    category: "social",
    benefit: "₹600 to ₹900 monthly pension",
    eligibility: ["Destitute persons", "Divyang persons", "Widows with children"],
    docs: ["Aadhaar Card", "Income Certificate", "Disability Certificate (if applicable)"],
    reqs: { format: "PDF", size: "400kb" }
  },

  // --- BUSINESS ---
  {
    id: "MH-BIZ-01",
    title: "Chief Minister Employment Generation Programme (CMEGP)",
    category: "business",
    benefit: "15% to 35% Subsidy on loans up to ₹50 Lakh",
    eligibility: ["Age 18-45", "New Entrepreneurs", "Class 7/10 passed based on loan amt"],
    docs: ["Aadhaar Card", "Project Report", "Caste Certificate", "Academic Docs"],
    reqs: { format: "PDF", size: "2mb" }
  }
];
