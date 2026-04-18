import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { centralSchemes } from '../data/centralSchemes';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Building2, Map, ChevronRight } from 'lucide-react';

const statesList = [
  {
    "id": "westBengal",
    "label": "West Bengal",
    "key": "westBengalSchemes"
  },
  {
    "id": "andhraPradesh",
    "label": "Andhra Pradesh",
    "key": "andhraPradeshSchemes"
  },
  {
    "id": "gujarat",
    "label": "Gujarat",
    "key": "gujaratSchemes"
  },
  {
    "id": "delhi",
    "label": "Delhi",
    "key": "delhiSchemes"
  },
  {
    "id": "bihar",
    "label": "Bihar",
    "key": "biharSchemes"
  },
  {
    "id": "karnataka",
    "label": "Karnataka",
    "key": "karnatakaSchemes"
  },
  {
    "id": "punjab",
    "label": "Punjab",
    "key": "punjabSchemes"
  },
  {
    "id": "maharashtra",
    "label": "Maharashtra",
    "key": "maharashtraSchemes"
  },
  {
    "id": "uttarPradesh",
    "label": "Uttar Pradesh",
    "key": "uttarPradeshSchemes"
  },
  {
    "id": "tamilNadu",
    "label": "Tamil Nadu",
    "key": "tamilNaduSchemes"
  }
];

export function ExploreScheme() {
  const navigate = useNavigate();
  const [activeAuthority, setActiveAuthority] = useState(null); // null, 'central' or 'state'
  const [selectedState, setSelectedState] = useState(null);
  const [schemes, setSchemes] = useState(centralSchemes);
  const [loading, setLoading] = useState(false);

  // Switch to Central Schemes
  useEffect(() => {
    if (activeAuthority === 'central') {
      setSchemes(centralSchemes);
      setSelectedState(null);
    }
  }, [activeAuthority]);

  // Load State Schemes dynamically
  useEffect(() => {
    if (activeAuthority === 'state' && selectedState) {
      const loadStateSchemes = async () => {
        setLoading(true);
        try {
          const stateModule = await import(`../data/states/${selectedState.id}.js`);
          const stateData = stateModule[selectedState.key];
          setSchemes(stateData || []);
        } catch (error) {
          console.error("Failed to load state data", error);
          setSchemes([]);
        } finally {
          setLoading(false);
        }
      };
      loadStateSchemes();
    } else if (activeAuthority === 'state' && !selectedState) {
      setSchemes([]);
    }
  }, [selectedState, activeAuthority]);

  return (
    <div className="space-y-10 px-6 py-10 max-w-6xl mx-auto font-sans text-white">
      <h1 className="text-4xl md:text-5xl font-black text-center uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
        Yojna Khojein <span className="text-[#ccff00]">(Explore)</span>
      </h1>

      {/* Dual-Authority Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveAuthority('central')}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border transition-all backdrop-blur-md ${
            activeAuthority === 'central' ? 'border-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_30px_rgba(204,255,0,0.15)] scale-105' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:scale-105'
          }`}
        >
          <Building2 className={`w-16 h-16 mb-4 ${activeAuthority === 'central' ? 'text-[#ccff00]' : 'text-gray-400'}`} />
          <h2 className="text-3xl font-bold text-white">Central Government</h2>
          <p className="text-xl mt-2 text-gray-400">Kendra Sarkar ki Yojna</p>
        </button>

        <button
          onClick={() => setActiveAuthority('state')}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border transition-all backdrop-blur-md ${
            activeAuthority === 'state' ? 'border-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_30px_rgba(204,255,0,0.15)] scale-105' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:scale-105'
          }`}
        >
          <Map className={`w-16 h-16 mb-4 ${activeAuthority === 'state' ? 'text-[#ccff00]' : 'text-gray-400'}`} />
          <h2 className="text-3xl font-bold text-white">State Government</h2>
          <p className="text-xl mt-2 text-gray-400">Rajya Sarkar ki Yojna</p>
        </button>
      </div>

      {/* State Selection Grid */}
      {activeAuthority === 'state' && (
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Apna Rajya (State) Chunein:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statesList.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedState(st)}
                className={`py-3 px-2 text-lg font-bold rounded-lg border transition-colors ${
                  selectedState?.id === st.id ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'text-gray-300 bg-black/50 border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scheme List Render */}
      <div className="space-y-6">
        {!activeAuthority ? (
          <p className="text-xl text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-2xl">Kripya upar se (Central / State) chunein.</p>
        ) : loading ? (
          <p className="text-2xl text-center text-[#ccff00] py-10 animate-pulse">Data load ho raha hai...</p>
        ) : schemes.length > 0 ? (
          schemes.map(scheme => (
            <Card key={scheme.id} className="bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-white">{scheme.title}</h2>
                  <p className="text-xl font-medium text-[#ccff00]">Labh (Benefit): {scheme.benefit}</p>
                </div>
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}?source=${activeAuthority}&state=${selectedState?.id || ''}`)}
                  className="flex items-center justify-center gap-2 py-4 px-8 text-xl font-bold text-black rounded-lg shrink-0 bg-[#ccff00] hover:bg-[#aacc00] transition-colors"
                >
                  Patrata Janein <ChevronRight className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          ))
        ) : activeAuthority === 'state' && !selectedState ? (
          <p className="text-xl text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-2xl">Rajya chunne ke baad yojnaein dikhengi.</p>
        ) : (
          <p className="text-xl text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-2xl">Koi yojna nahi mili.</p>
        )}
      </div>
    </div>
  );
}