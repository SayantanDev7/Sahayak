import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 px-6 pt-10 pb-20 font-sans text-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
          Contact <span className="text-[#ccff00]">Us</span>
        </h1>
        <p className="text-xl text-gray-400">
          Sarkar se judi madad ke liye humse sampark karein
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white">Humse Baat Karein</h2>
            <p className="text-gray-400">Reach out for queries or support.</p>
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
              <span className="text-lg">New Delhi, India</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Aapka Naam</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none" 
                  placeholder="Rahul Kumar"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Aapka Sandesh (Message)</label>
                <textarea 
                  required
                  rows="4" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
                  placeholder="Apni pareshani yahan likhein..."
                ></textarea>
              </div>
              <Button type="submit" className="w-full py-4 text-black bg-[#ccff00] hover:bg-[#aacc00] font-bold text-lg flex items-center justify-center gap-2">
                {submitted ? 'Sandesh Bhej Diya!' : (
                  <>Bhejein (Submit) <Send className="w-5 h-5" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
