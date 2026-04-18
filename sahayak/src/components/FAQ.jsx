import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  { question: "How does Sahayak match schemes?", answer: "Our system uses advanced AI to analyze your profile and instantly cross-reference it with thousands of state and central databases." },
  { question: "Is my personal data secure?", answer: "Yes. We employ end-to-end encryption and strictly adhere to data protection guidelines. Your data is never shared with third parties." },
  { question: "Do I need to pay for this service?", answer: "No, Sahayak is completely free for citizens. Our goal is to make government schemes accessible to everyone." },
  { question: "Can I apply directly from Sahayak?", answer: "Yes, for supported schemes, our smart document processing allows you to apply with a single click." }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mx-auto py-24 px-8 font-sans text-white border-t border-white/10 w-full mt-20"
    >
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left Side */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-8">
            Questions?<br />We've Got Answers
          </h2>
          <Link to="/contact" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-[#ccff00] transition-colors mt-4 inline-block">
            Contact Us ↗
          </Link>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              onClick={() => toggleFaq(index)}
              className="bg-[#141414] border border-white/10 p-6 rounded-xl flex flex-col cursor-pointer hover:border-[#ccff00] transition-colors"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-lg pr-4">{faq.question}</h3>
                <div>
                  {openIndex === index ? (
                    <Minus className="text-[#ccff00]" size={24} />
                  ) : (
                    <Plus className="text-[#ccff00]" size={24} />
                  )}
                </div>
              </div>
              
              {openIndex === index && (
                <div className="mt-4 text-gray-400 leading-relaxed pr-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>
    </motion.div>
  );
};
