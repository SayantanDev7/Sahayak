import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exploredSchemes } from '../utils/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Search } from 'lucide-react';

const chips = ['All', 'Farmer', 'Student', 'Business'];

export function ExploreScheme() {
  const navigate = useNavigate();
  const [activeChip, setActiveChip] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchemes = exploredSchemes.filter(scheme => {
    const matchesChip = activeChip === 'All' || scheme.category === activeChip;
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChip && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center" style={{ color: '#000080' }}>
        Sarkari Yojna (Schemes)
      </h1>

      <div className="relative">
        <label htmlFor="search-schemes" className="sr-only">Search Schemes</label>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
        <input 
          id="search-schemes"
          type="text" 
          placeholder="Yojna ka naam khojein..." 
          className="w-full pl-14 pr-4 py-4 text-xl border-2 rounded-xl focus:outline-none"
          style={{ borderColor: '#FF9933' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {chips.map(chip => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className="px-6 py-3 text-xl font-bold rounded-full transition-colors border-2"
            style={{ 
              backgroundColor: activeChip === chip ? '#FF9933' : '#ffffff',
              color: activeChip === chip ? '#ffffff' : '#000080',
              borderColor: '#FF9933'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="grid gap-6 mt-8">
        {filteredSchemes.map(scheme => (
          <Card key={scheme.id} className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate(`/scheme/${scheme.id}`)}>
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold" style={{ color: '#138808' }}>{scheme.title}</h2>
              <p className="text-xl mt-2 text-gray-700">{scheme.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {scheme.chips.map(chip => (
                  <span key={chip} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-lg border border-gray-300">
                    {chip}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredSchemes.length === 0 && (
          <p className="text-2xl text-center text-gray-500 py-12">Koi yojna nahi mili.</p>
        )}
      </div>
    </div>
  );
}