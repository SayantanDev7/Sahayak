import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { centralSchemes } from '../data/centralSchemes';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Building2, Map, ChevronRight, CheckCircle2, FilterX, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useUserSchemes } from '../hooks/useUserSchemes';

const statesList = [
  { id: "westBengal",    label: "West Bengal",    labelHi: "पश्चिम बंगाल",  key: "westBengalSchemes" },
  { id: "andhraPradesh", label: "Andhra Pradesh", labelHi: "आंध्र प्रदेश",  key: "andhraPradeshSchemes" },
  { id: "gujarat",       label: "Gujarat",        labelHi: "गुजरात",         key: "gujaratSchemes" },
  { id: "delhi",         label: "Delhi",          labelHi: "दिल्ली",         key: "delhiSchemes" },
  { id: "bihar",         label: "Bihar",          labelHi: "बिहार",          key: "biharSchemes" },
  { id: "karnataka",     label: "Karnataka",      labelHi: "कर्नाटक",        key: "karnatakaSchemes" },
  { id: "punjab",        label: "Punjab",         labelHi: "पंजाब",          key: "punjabSchemes" },
  { id: "maharashtra",   label: "Maharashtra",    labelHi: "महाराष्ट्र",     key: "maharashtraSchemes" },
  { id: "uttarPradesh",  label: "Uttar Pradesh",  labelHi: "उत्तर प्रदेश",   key: "uttarPradeshSchemes" },
  { id: "tamilNadu",     label: "Tamil Nadu",     labelHi: "तमिल नाडु",      key: "tamilNaduSchemes" }
];

const CATEGORIES = [
  { name: "Agriculture", slug: "agriculture" },
  { name: "Banking", slug: "banking" },
  { name: "Business", slug: "business" },
  { name: "Education", slug: "education" },
  { name: "Health", slug: "health" },
  { name: "Housing", slug: "housing" },
  { name: "Safety", slug: "safety" },
  { name: "Science", slug: "science" },
  { name: "Employment", slug: "employment" },
  { name: "Social Welfare", slug: "social" },
  { name: "Sports", slug: "sports" },
  { name: "Transport", slug: "transport" },
  { name: "Travel", slug: "travel" },
  { name: "Utility", slug: "utility" },
  { name: "Women & Child", slug: "women" }
];

export function ExploreScheme() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeAuthority, setActiveAuthority] = useState('central'); // default to central
  const [selectedState, setSelectedState] = useState(null);
  const [rawSchemes, setRawSchemes] = useState(centralSchemes);
  const [loading, setLoading] = useState(false);
  const { isEnrolled } = useUserSchemes();

  // Load State Schemes dynamically
  useEffect(() => {
    if (activeAuthority === 'state' && selectedState) {
      const loadStateSchemes = async () => {
        setLoading(true);
        try {
          const stateModule = await import(`../data/states/${selectedState.id}.js`);
          const stateData = stateModule[selectedState.key];
          setRawSchemes(stateData || []);
        } catch (error) {
          console.error("Failed to load state data", error);
          setRawSchemes([]);
        } finally {
          setLoading(false);
        }
      };
      loadStateSchemes();
    } else if (activeAuthority === 'central') {
      setRawSchemes(centralSchemes);
      setSelectedState(null);
    } else if (activeAuthority === 'state' && !selectedState) {
      setRawSchemes([]);
    }
  }, [selectedState, activeAuthority]);

  // Filter Logic
  const filteredSchemes = useMemo(() => {
    if (!categoryParam) return rawSchemes;
    return rawSchemes.filter(s => s.category === categoryParam);
  }, [rawSchemes, categoryParam]);

  const handleCategorySelect = (slug) => {
    if (categoryParam === slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 px-6 pt-32 pb-20 max-w-6xl mx-auto font-sans text-white"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
          {t.explore.title}{t.explore.titleSpan && <> <span className="text-[#ccff00]">{t.explore.titleSpan}</span></>}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore government initiatives designed to empower every citizen. Switch between Central and State authorities to find relevant benefits.
        </p>
      </div>

      {/* ── Category Chips ───────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Filter by Category</h3>
          {categoryParam && (
            <button 
              onClick={clearFilters}
              className="text-xs font-bold text-[#ccff00] flex items-center gap-1 hover:underline"
            >
              <FilterX className="w-3 h-3" /> {t.explore.clearFilter || 'Clear Filter'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                categoryParam === cat.slug 
                  ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Authority Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveAuthority('central')}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border transition-all backdrop-blur-md ${
            activeAuthority === 'central' ? 'border-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_30px_rgba(204,255,0,0.15)]' : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
        >
          <Building2 className={`w-16 h-16 mb-4 ${activeAuthority === 'central' ? 'text-[#ccff00]' : 'text-gray-400'}`} />
          <h2 className="text-3xl font-bold text-white">{t.explore.central}</h2>
          <p className="text-xl mt-2 text-gray-400">{t.explore.centralDesc}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveAuthority('state')}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border transition-all backdrop-blur-md ${
            activeAuthority === 'state' ? 'border-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_30px_rgba(204,255,0,0.15)]' : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
        >
          <Map className={`w-16 h-16 mb-4 ${activeAuthority === 'state' ? 'text-[#ccff00]' : 'text-gray-400'}`} />
          <h2 className="text-3xl font-bold text-white">{t.explore.state}</h2>
          <p className="text-xl mt-2 text-gray-400">{t.explore.stateDesc}</p>
        </motion.button>
      </div>

      {/* State List */}
      <AnimatePresence>
        {activeAuthority === 'state' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 overflow-hidden"
          >
            <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">{t.explore.stateSelect}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {statesList.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedState(st)}
                  className={`py-3 px-2 text-lg font-bold rounded-lg border transition-colors ${
                    selectedState?.id === st.id ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'text-gray-300 bg-black/50 border-white/10 hover:border-white/30'
                  }`}
                >
                  {language === 'hi' ? st.labelHi : st.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheme List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">
            Available Schemes <span className="text-[#ccff00]">({filteredSchemes.length})</span>
          </h2>
          {categoryParam && (
            <div className="bg-[#ccff00]/10 text-[#ccff00] px-3 py-1 rounded-full text-xs font-bold border border-[#ccff00]/20 flex items-center gap-2">
              Showing: {CATEGORIES.find(c => c.slug === categoryParam)?.name}
              <X className="w-3 h-3 cursor-pointer" onClick={clearFilters} />
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-[#ccff00] animate-pulse">{t.explore.loading}</p>
          </div>
        ) : filteredSchemes.length > 0 ? (
          <div className="grid gap-6">
            {filteredSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border border-white/10 hover:border-[#ccff00]/30 backdrop-blur-md transition-all group">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-white group-hover:text-[#ccff00] transition-colors">{t.schemeTitles[scheme.title] || scheme.title}</h2>
                        {isEnrolled(scheme.id) && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="w-4 h-4" /> {t.userHub?.enrolled || 'Enrolled'}
                          </span>
                        )}
                        {scheme.category && (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-black bg-white/10 text-gray-400 rounded tracking-tighter">
                            {scheme.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-medium text-[#ccff00]">{t.explore.benefit} {scheme.benefit}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/scheme/${scheme.id}?source=${activeAuthority}&state=${selectedState?.id || ''}`)}
                      className="flex items-center justify-center gap-2 py-4 px-8 text-xl font-bold text-black rounded-lg shrink-0 bg-[#ccff00] hover:bg-[#aacc00] transition-colors shadow-lg hover:shadow-[#ccff00]/20"
                    >
                      {t.explore.knowEligibility} <ChevronRight className="w-5 h-5" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm"
          >
            <div className="mb-6 inline-flex p-6 rounded-full bg-red-500/10 text-red-500">
              <FilterX className="w-12 h-12" />
            </div>
            <p className="text-gray-400 text-sm mb-8 opacity-80">
              {t.explore.noResultsMessage}
            </p>
            <button 
              onClick={clearFilters}
              className="px-8 py-4 bg-[#ccff00] text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Show All Schemes
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}