export const exploredSchemes = [
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi',
    description: 'Bhartiya kisano ko salana ₹6000 ki aarthik madad. Zameen wale kisano ke liye.',
    category: 'Farmer',
    chips: ['Farmer', 'Financial Aid', 'Central Govt'],
    requirements: [
      { id: 'req_1', label: 'Aadhaar Card', format: 'PDF/JPG', maxSize: '200KB' },
      { id: 'req_2', label: 'Bank Passbook / Cancelled Cheque', format: 'PDF', maxSize: '500KB' },
      { id: 'req_3', label: 'Land Record (Khatauni)', format: 'PDF', maxSize: '1MB' }
    ]
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana',
    description: 'Beti bachao, beti padhao. Apni beti ke bhavishya ke liye bachat khata.',
    category: 'Student',
    chips: ['Student', 'Girl Child', 'Savings'],
    requirements: [
      { id: 'req_4', label: 'Birth Certificate of Girl Child', format: 'PDF', maxSize: '500KB' },
      { id: 'req_5', label: 'Parent ID (Aadhaar/PAN)', format: 'PDF/JPG', maxSize: '200KB' }
    ]
  },
  {
    id: 'pm-mudra',
    title: 'Pradhan Mantri Mudra Yojana',
    description: 'Chhote vyapar shuru karne ya badhane ke liye ₹10 lakh tak ka loan kharcha.',
    category: 'Business',
    chips: ['Business', 'Loan', 'Startup'],
    requirements: [
      { id: 'req_6', label: 'Aadhaar / Voter ID', format: 'PDF/JPG', maxSize: '200KB' },
      { id: 'req_7', label: 'Business Proof (Shop License)', format: 'PDF', maxSize: '1MB' },
      { id: 'req_8', label: '6 Months Bank Statement', format: 'PDF', maxSize: '2MB' }
    ]
  }
];

export const userProgressData = {
  activeApplication: {
    schemeId: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi',
    progress: 33, // 1 out of 3 docs
    documents: [
      { id: 'req_1', status: 'uploaded', file: 'aadhaar_card.pdf' },
      { id: 'req_2', status: 'pending', file: null },
      { id: 'req_3', status: 'pending', file: null }
    ]
  }
};
