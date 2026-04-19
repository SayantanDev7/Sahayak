import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { centralSchemes } from '../data/centralSchemes';
import { SmartStepper } from '../components/SmartStepper';
import { useProgress } from '../hooks/useProgress';
import { useUserSchemes } from '../hooks/useUserSchemes';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function SchemeDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'central';
  const stateId = searchParams.get('state');

  const navigate = useNavigate();
  const { startApplication, progressData } = useProgress();
  const { enrollScheme, isEnrolled, updateSchemeDoc } = useUserSchemes();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDocIndex, setActiveDocIndex] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        if (source === 'central') {
          const found = centralSchemes.find(s => s.id === id);
          setScheme(found);
        } else if (source === 'state' && stateId) {
          const stateModule = await import(`../data/states/${stateId}.js`);
          // Extract specific array using key pattern or scan exported arrays
          const moduleKey = Object.keys(stateModule)[0];
          const stateSchemes = stateModule[moduleKey];
          const found = stateSchemes?.find(s => s.id === id);
          setScheme(found);
        }
      } catch (error) {
        console.error("Error fetching scheme", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id, source, stateId]);

  if (loading) {
    return <div className="text-2xl text-center py-10 font-bold text-[#ccff00] animate-pulse">{t.schemeDetails.loading}</div>;
  }

  if (!scheme) {
    return <div className="text-2xl text-center py-10 text-red-400">{t.schemeDetails.notFound}</div>;
  }

  // Check if we already started this application
  const isActiveApp = progressData?.schemeId === scheme.id;
  
  // Transform docs into the format ProgressContext expects internally if needed, or simply handle them by index/name
  const docsStatus = isActiveApp ? progressData.documents : scheme.docs.map((d, idx) => ({ id: `doc_${idx}`, status: 'pending' }));

  // Helper to translate criteria like "Target Group: OBC/EBC"
  const translateCriterion = (criterion) => {
    if (!criterion.includes(':')) {
      return t.criteriaKeys[criterion] || criterion;
    }
    const [key, value] = criterion.split(':').map(s => s.trim());
    const translatedKey = t.criteriaKeys[key] || key;
    const translatedValue = t.criteriaKeys[value] || value;
    return `${translatedKey}: ${translatedValue}`;
  };

  // Helper to translate document names
  const translateDoc = (docName) => {
    return t.commonDocs[docName] || docName;
  };

  const schemeTitle = t.schemeTitles[scheme.title] || scheme.title;

  const handleStart = async () => {
    // 1. Start in ProgressContext for active upload flow
    startApplication({
      id: scheme.id,
      title: schemeTitle,
      source,
      stateId: stateId || '',
      requirements: scheme.docs.map((doc, idx) => ({ id: `doc_${idx}`, label: translateDoc(doc) }))
    });

    // 2. Enroll in UserSchemeContext → syncs to backend
    await enrollScheme({
      id: scheme.id,
      title: schemeTitle,
      source,
      stateId: stateId || '',
      docs: scheme.docs
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-8 max-w-5xl mx-auto px-6 py-8 font-sans text-white"
    >
      <Button 
        variant="outline" 
        onClick={() => navigate('/explore')}
        className="flex items-center gap-2 text-xl py-2 px-4 text-gray-300 bg-white/5 border-white/20 hover:bg-white/10 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" /> {t.schemeDetails.back}
      </Button>

      <Card className="border-t-4 bg-white/5 border border-white/10 backdrop-blur-md" style={{ borderTopColor: '#ccff00' }}>
        <CardHeader>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            {schemeTitle}
          </h1>
          <p className="text-2xl mt-2 text-[#ccff00]">{t.schemeDetails.benefit} {scheme.benefit}</p>
        </CardHeader>
      </Card>

      <section aria-labelledby="eligibility-table">
        <h2 id="eligibility-table" className="text-3xl font-bold mb-4 text-white">
          {t.schemeDetails.eligibility}
        </h2>
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-sm backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <tbody>
              {scheme.eligibility.map((criterion, index) => (
                <tr key={index} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}>
                  <td className="p-5 text-xl font-medium text-gray-200">{translateCriterion(criterion)}</td>
                  <td className="p-5 flex justify-end">
                    <CheckCircle2 className="w-8 h-8 text-[#ccff00]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="document-checklist">
        <h2 id="document-checklist" className="text-3xl font-bold mb-4 text-white">
          {t.schemeDetails.docs}
        </h2>

        {!isActiveApp && (
          <div className="mb-6">
            <Button 
              className="py-4 px-8 text-2xl font-bold w-full md:w-auto transition-all hover:scale-105 text-black bg-[#ccff00] hover:bg-[#aacc00]"
              onClick={handleStart}
            >
              {t.schemeDetails.applyNow}
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {scheme.docs.map((docName, idx) => {
            const reqId = `doc_${idx}`;
            const docStatusObj = docsStatus?.find(d => d.id === reqId);
            const isUploaded = docStatusObj?.status === 'uploaded';
            const isActiveUpload = activeDocIndex === idx;
            const translatedDocName = translateDoc(docName);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <Card 
                  className={`transition-all border-l-4 backdrop-blur-md h-full ${isUploaded ? 'bg-green-500/10 border-green-500' : 'bg-white/5 border-white/20'}`}
                >
                  <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {translatedDocName}
                        {isUploaded && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                      </h3>
                      <p className="text-lg mt-1 text-gray-400">
                        {t.schemeDetails.required} {scheme.reqs.format} {t.schemeDetails.maxSize} {scheme.reqs.size})
                      </p>
                    </div>

                    {isActiveApp && !isUploaded && (
                      <Button
                        variant={isActiveUpload ? "default" : "outline"}
                        onClick={() => setActiveDocIndex(isActiveUpload ? null : idx)}
                        className={`text-xl py-2 px-6 ${isActiveUpload ? 'text-black bg-[#ccff00] hover:bg-[#aacc00] border-none' : 'text-gray-300 border-white/20 hover:bg-white/10 hover:text-white'}`}
                      >
                        {isActiveUpload ? t.schemeDetails.close : t.schemeDetails.upload}
                      </Button>
                    )}
                  </div>

                  {isActiveUpload && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <SmartStepper 
                        requirementDetails={`${t.schemeDetails.convert1} ${scheme.reqs.format}. (${scheme.reqs.size} ${t.schemeDetails.convert3})`} 
                        reqId={reqId}
                        onSuccess={() => setActiveDocIndex(null)}
                        schemeName={schemeTitle}
                        schemeId={scheme.id}
                        schemeReqs={scheme.reqs}
                      />
                    </div>
                  )}
                </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}