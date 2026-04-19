import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-4xl mx-auto space-y-12 px-6 pt-50 pb-20 font-sans text-white"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
          {t.contact.title} <span className="text-[#ccff00]">{t.contact.titleSpan}</span>
        </h1>
        <p className="text-xl text-gray-400">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white">{t.contact.talkToUs}</h2>
            <p className="text-gray-400">{t.contact.reachOut}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
              <Phone className="w-6 h-6 text-[#ccff00]" />
              <span className="text-lg">1800-XXX-XXXX (Toll Free)</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
              <Mail className="w-6 h-6 text-[#ccff00]" />
              <span className="text-lg">sahayata@sahayak.gov.in</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
              <MapPin className="w-6 h-6 text-[#ccff00] shrink-0" />
              <span className="text-lg">{t.contact.city}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.nameLabel}</label>
                <input
                  required
                  type="text"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
                  placeholder={t.contact.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.msgLabel}</label>
                <textarea
                  required
                  rows="4"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
                  placeholder={t.contact.msgPlaceholder}
                ></textarea>
              </div>
              <Button type="submit" className="w-full py-4 text-black bg-[#ccff00] hover:bg-[#aacc00] font-bold text-lg flex items-center justify-center gap-2">
                {submitted ? t.contact.submittedBtn : (
                  <>{t.contact.submitBtn} <Send className="w-5 h-5" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
