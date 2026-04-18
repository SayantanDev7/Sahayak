import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ApplicationTracker } from '../components/ApplicationTracker';
import { useProgress } from '../hooks/useProgress';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export function UserHub() {
  const navigate = useNavigate();
  const { progressData } = useProgress();

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-6 py-10 font-sans text-white">
      {/* SECTION A: Meri Pragati */}
      <section aria-labelledby="meri-pragati">
        <h2 id="meri-pragati" className="text-3xl font-bold mb-6 text-white tracking-tight">
          Meri Pragati (My Progress)
        </h2>
        
        {progressData ? (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="flex flex-col items-center justify-center p-6 border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/30 transition-all">
              <h3 className="text-2xl font-bold mb-4 line-clamp-1 text-[#ccff00]">
                {progressData.title}
              </h3>
              <CircularProgress progress={progressData.progress} size={150} />
              <p className="text-xl mt-4 text-gray-300 text-center">
                Dastavez upload baaki hai
              </p>
              <Button 
                className="mt-6 w-full py-4 text-xl font-bold bg-[#ccff00] text-black hover:bg-[#aacc00] transition-colors" 
                onClick={() => navigate(`/scheme/${progressData.schemeId}`)}
              >
                Yahan se shuru karein
              </Button>
            </Card>

            <ApplicationTracker />
          </div>
        ) : (
          <Card className="p-8 text-center bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-2xl text-gray-400">Koi active application nahi mili.</p>
          </Card>
        )}
      </section>

      {/* SECTION B: Nayi Schemes */}
      <section aria-labelledby="nayi-schemes">
        <Card className="border border-[#ccff00] bg-[#ccff00]/5 backdrop-blur-md hover:bg-[#ccff00]/10 transition-colors">
          <CardHeader>
            <h2 id="nayi-schemes" className="text-3xl font-bold text-white tracking-tight">
              Nayi Schemes (Explore)
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-2xl text-gray-300">
              Sarkar ki nayi yojnao ka labh uthayein. Jaaniye aap kis scheme ke liye patra hain.
            </p>
            <Button 
              className="py-4 px-8 text-2xl font-bold shrink-0 bg-[#ccff00] text-black hover:bg-[#aacc00] transition-colors" 
              onClick={() => navigate('/explore')}
            >
              Yojna Khojein
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}