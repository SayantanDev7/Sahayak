import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '../components/ui/CircularProgress';
import { useUserSchemes } from '../hooks/useUserSchemes';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { ArrowRight, FileCheck, FileClock, FileX, Compass, Sparkles, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function UserHub() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enrolledSchemes, loading: schemesLoading } = useUserSchemes();

  // Derive display name
  const displayName = user?.displayName || user?.email?.split('@')[0] || t.userHub.defaultUser || 'User';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-12 max-w-6xl mx-auto px-6 pt-32 pb-20 font-sans text-white"
    >
      {/* ── Greeting Header ─────────────────────────────────── */}
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-3 mx-auto mb-2"
        >
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="avatar" 
              className="w-14 h-14 rounded-full border-2 border-[#ccff00] object-cover" 
            />
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-[#ccff00] bg-[#ccff00]/10 flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-[#ccff00]" />
            </div>
          )}
        </motion.div>
        <h1 data-debug="v2" className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
          {(t.userHub.greeting || 'Namaste').replace('{name}', '')}
          <span className="text-[#ccff00]"> {displayName}</span>!
        </h1>
        <p className="text-lg text-gray-500 mt-2">{t.userHub.subtitle}</p>
      </div>

      {/* ── SECTION A: Meri Pragati — Enrolled Schemes ─────── */}
      <section aria-labelledby="meri-pragati">
        <h2 id="meri-pragati" className="text-2xl font-bold mb-6 text-gray-300 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#ccff00]" />
          {t.userHub.pragati}
        </h2>

        {schemesLoading ? (
          <div className="text-xl text-center text-[#ccff00] py-10 animate-pulse">Loading...</div>
        ) : enrolledSchemes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledSchemes.map((app, index) => {
              const totalDocs = app.documents?.length || 0;
              const uploadedDocs = app.documents?.filter(d => d.status === 'uploaded').length || 0;
              const pendingDocs = totalDocs - uploadedDocs;
              const rejectedDocs = app.documents?.filter(d => d.status === 'rejected').length || 0;
              const progress = app.progress || 0;
              const isComplete = progress >= 100;

              return (
                <motion.div
                  key={app.schemeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all h-full">
                    {/* Scheme Title */}
                    <h3 className="text-xl font-bold mb-4 text-center text-[#ccff00] line-clamp-2 min-h-[3.5rem]">
                      {t.schemeTitles[app.schemeName] || app.schemeName}
                    </h3>

                    {/* Circular Progress */}
                    <CircularProgress progress={progress} size={130} strokeWidth={10} />

                    {/* Status Badge */}
                    <span className={`mt-4 inline-block px-3 py-1 text-sm font-bold rounded-full ${
                      isComplete 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                        : 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30'
                    }`}>
                      {isComplete ? (t.userHub.submitted || 'Submitted') : (t.userHub.inProgressLabel || 'In Progress')}
                    </span>

                    {/* Doc Stats */}
                    <div className="flex gap-5 mt-4 text-center">
                      <div className="flex flex-col items-center">
                        <FileCheck className="w-4 h-4 text-green-400 mb-1" />
                        <span className="text-xl font-bold text-white">{uploadedDocs}</span>
                        <span className="text-xs text-gray-500">{t.userHub.done}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <FileClock className="w-4 h-4 text-yellow-400 mb-1" />
                        <span className="text-xl font-bold text-white">{pendingDocs}</span>
                        <span className="text-xs text-gray-500">{t.userHub.pending}</span>
                      </div>
                      {rejectedDocs > 0 && (
                        <div className="flex flex-col items-center">
                          <FileX className="w-4 h-4 text-red-400 mb-1" />
                          <span className="text-xl font-bold text-white">{rejectedDocs}</span>
                          <span className="text-xs text-gray-500">{t.userHub.rejected}</span>
                        </div>
                      )}
                    </div>

                    {/* Doc Breakdown */}
                    <div className="w-full mt-4 space-y-1">
                      {(app.documents || []).map((doc, idx) => (
                        <div
                          key={doc.docId}
                          className={`flex items-center justify-between py-1.5 px-3 rounded-lg text-xs ${
                            doc.status === 'uploaded' ? 'bg-green-500/10 text-green-400' :
                            doc.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-white/5 text-gray-400'
                          }`}
                        >
                          <span className="font-medium truncate">{doc.label || `${t.userHub.docLabel} ${idx + 1}`}</span>
                          <span className="uppercase text-[10px] font-bold tracking-wider shrink-0 ml-2">
                            {doc.status === 'uploaded' ? `✅` : doc.status === 'rejected' ? `❌` : `⏳`}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Resume Button */}
                    {!isComplete && (
                      <button 
                        className="mt-4 w-full py-3 px-4 text-lg font-bold bg-[#ccff00] text-black rounded-lg hover:bg-[#aacc00] transition-all active:scale-95 flex items-center justify-center gap-2" 
                        onClick={() => navigate(`/scheme/${app.schemeId}?source=${app.source || 'central'}&state=${app.stateId || ''}`)}
                      >
                        {t.userHub.resume || 'Resume'} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── Welcome State (New User) ──────────────────────── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-10 text-center bg-white/5 border border-dashed border-white/10 backdrop-blur-md rounded-2xl"
          >
            <div className="flex justify-center mb-6">
              <CircularProgress progress={0} size={120} strokeWidth={10} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {t.userHub.welcomeTitle || 'Welcome to Sahayak!'}
            </h3>
            <p className="text-xl text-gray-500 mb-6">
              {t.userHub.welcomeDesc || 'Start by exploring government schemes and applying for the ones you are eligible for.'}
            </p>
            <button 
              className="py-4 px-10 text-xl font-bold bg-[#ccff00] text-black rounded-lg hover:bg-[#aacc00] transition-colors active:scale-95"
              onClick={() => navigate('/explore')}
            >
              {t.userHub.exploreNew} <ArrowRight className="w-5 h-5 inline ml-1" />
            </button>
          </motion.div>
        )}
      </section>

      {/* ── SECTION B: Nayi Schemes — Explore ───────────────── */}
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