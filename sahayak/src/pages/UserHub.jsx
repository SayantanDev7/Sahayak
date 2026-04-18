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
    <div className="space-y-12">
      {/* SECTION A: Meri Pragati */}
      <section aria-labelledby="meri-pragati">
        <h2 id="meri-pragati" className="text-3xl font-bold mb-6" style={{ color: '#000080' }}>
          Meri Pragati (My Progress)
        </h2>
        
        {progressData ? (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="flex flex-col items-center justify-center p-6 border-2" style={{ borderColor: '#FF9933' }}>
              <h3 className="text-2xl font-bold mb-4 line-clamp-1" style={{ color: '#138808' }}>
                {progressData.title}
              </h3>
              <CircularProgress progress={progressData.progress} size={150} />
              <p className="text-xl mt-4 text-gray-700 text-center">
                Dastavez upload baaki hai
              </p>
              <Button 
                className="mt-6 w-full py-4 text-xl font-bold" 
                style={{ backgroundColor: '#FF9933', color: 'white' }}
                onClick={() => navigate(`/scheme/${progressData.schemeId}`)}
              >
                Yahan se shuru karein
              </Button>
            </Card>

            <ApplicationTracker />
          </div>
        ) : (
          <Card className="p-8 text-center bg-white border border-gray-200">
            <p className="text-2xl text-gray-600">Koi active application nahi mili.</p>
          </Card>
        )}
      </section>

      {/* SECTION B: Nayi Schemes */}
      <section aria-labelledby="nayi-schemes">
        <Card className="border-4" style={{ borderColor: '#FF9933', backgroundColor: '#FFF3E0' }}>
          <CardHeader>
            <h2 id="nayi-schemes" className="text-3xl font-bold" style={{ color: '#000080' }}>
              Nayi Schemes (Explore)
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-2xl text-gray-800">
              Sarkar ki nayi yojnao ka labh uthayein. Jaaniye aap kis scheme ke liye patra hain.
            </p>
            <Button 
              className="py-4 px-8 text-2xl font-bold shrink-0" 
              style={{ backgroundColor: '#138808', color: 'white' }}
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