import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ApplicationTracker } from '../components/ApplicationTracker';
import { useApplication } from '../hooks/useApplication';
import { motion } from 'framer-motion';
import { ArrowRight, FileCheck, FileClock, FileX, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function UserHub() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    progressData,
    appProgress,
    isComplete,
    hasActiveApp,
    totalDocs,
    uploadedDocs,
    pendingDocs,
    rejectedDocs,
    resumeApplication
  } = useApplication();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-12 max-w-6xl mx-auto px-6 py-10 font-sans text-white"
    >
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
          {t.userHub.title.split(' ')[0]} <span className="text-[#ccff00]">{t.userHub.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-lg text-gray-500 mt-2">{t.userHub.subtitle}</p>
      </div>

      {/* SECTION A: Active Application / Meri Pragati */}
      <section aria-labelledby="meri-pragati">
        <h2 id="meri-pragati" className="text-2xl font-bold mb-6 text-gray-300 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#ccff00]" />
          {t.userHub.pragati}
        </h2>
        
        {hasActiveApp ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Progress Card */}
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all h-full">
                <h3 className="text-2xl font-bold mb-6 text-center text-[#ccff00] line-clamp-1">
                  {t.schemeTitles[progressData.title] || progressData.title}
                </h3>

                <CircularProgress progress={appProgress} size={160} strokeWidth={12} />

                {/* Doc Stats */}
                <div className="flex gap-6 mt-6 text-center">
                  <div className="flex flex-col items-center">
                    <FileCheck className="w-5 h-5 text-green-400 mb-1" />
                    <span className="text-2xl font-bold text-white">{uploadedDocs}</span>
                    <span className="text-xs text-gray-500">{t.userHub.done}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <FileClock className="w-5 h-5 text-yellow-400 mb-1" />
                    <span className="text-2xl font-bold text-white">{pendingDocs}</span>
                    <span className="text-xs text-gray-500">{t.userHub.pending}</span>
                  </div>
                  {rejectedDocs > 0 && (
                    <div className="flex flex-col items-center">
                      <FileX className="w-5 h-5 text-red-400 mb-1" />
                      <span className="text-2xl font-bold text-white">{rejectedDocs}</span>
                      <span className="text-xs text-gray-500">{t.userHub.rejected}</span>
                    </div>
                  )}
                </div>

                {/* Resume / Complete Message */}
                {isComplete ? (
                  <div className="mt-6 w-full text-center py-4 px-6 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-lg font-bold text-green-400">
                      {t.userHub.allUploaded}
                    </p>
                  </div>
                ) : (
                  <button 
                    className="mt-6 w-full py-4 px-6 text-xl font-bold bg-[#ccff00] text-black rounded-lg hover:bg-[#aacc00] transition-all active:scale-95 flex items-center justify-center gap-2" 
                    onClick={resumeApplication}
                  >
                    {t.userHub.startHere} <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {/* Document breakdown list */}
                <div className="w-full mt-6 space-y-2">
                  {progressData.documents.map((doc, idx) => (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between py-2 px-4 rounded-lg text-sm ${
                        doc.status === 'uploaded' ? 'bg-green-500/10 text-green-400' :
                        doc.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-white/5 text-gray-400'
                      }`}
                    >
                      <span className="font-medium">{t.userHub.docLabel} {idx + 1}: {doc.file || t.userHub.notUploaded}</span>
                      <span className="uppercase text-xs font-bold tracking-wider">
                        {doc.status === 'uploaded' ? `✅ ${t.userHub.done}` : doc.status === 'rejected' ? `❌ ${t.userHub.rejected}` : `⏳ ${t.userHub.pending}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Application Tracker */}
            <ApplicationTracker />
          </div>
        ) : (
          <div className="p-10 text-center bg-white/5 border border-dashed border-white/10 backdrop-blur-md rounded-2xl">
            <p className="text-2xl text-gray-500 mb-4">{t.userHub.noApp}</p>
            <button 
              className="py-3 px-8 text-lg font-bold bg-[#ccff00] text-black rounded-lg hover:bg-[#aacc00] transition-colors"
              onClick={() => navigate('/explore')}
            >
              {t.userHub.exploreNew}
            </button>
          </div>
        )}
      </section>

      {/* SECTION B: Nayi Schemes — Explore */}
      <section aria-labelledby="nayi-schemes">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="border border-[#ccff00]/30 bg-gradient-to-br from-[#ccff00]/5 to-transparent backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 id="nayi-schemes" className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Compass className="w-8 h-8 text-[#ccff00]" />
                {t.userHub.explore}
              </h2>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xl text-gray-400">
                {t.userHub.exploreDesc}
              </p>
              <button 
                className="py-4 px-8 text-xl font-bold shrink-0 bg-[#ccff00] text-black rounded-lg hover:bg-[#aacc00] transition-all active:scale-95 flex items-center gap-2" 
                onClick={() => navigate('/explore')}
              >
                {t.userHub.exploreBtn} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}