import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exploredSchemes } from '../utils/mockData';
import { SmartStepper } from '../components/SmartStepper';
import { useProgress } from '../hooks/useProgress';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';

export function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startApplication, progressData } = useProgress();
  const scheme = exploredSchemes.find(s => s.id === id);

  const [activeReqId, setActiveReqId] = useState(null);

  if (!scheme) {
    return <div className="text-2xl text-center py-10">Yojna nahi mili (Scheme not found).</div>;
  }

  // Check if we already started this application
  const isActiveApp = progressData?.schemeId === scheme.id;
  const docs = isActiveApp ? progressData.documents : scheme.requirements.map(r => ({ id: r.id, status: 'pending' }));

  const handleStart = () => {
    startApplication(scheme);
  };

  return (
    <div className="space-y-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/explore')}
        className="flex items-center gap-2 text-xl py-2 px-4 text-gray-700 bg-white border-gray-300"
      >
        <ChevronLeft className="w-6 h-6" /> Peeche Jayein
      </Button>

      <Card className="border-t-8" style={{ borderColor: '#FF9933' }}>
        <CardHeader>
          <h1 className="text-4xl font-bold" style={{ color: '#000080' }}>
            {scheme.title}
          </h1>
          <p className="text-2xl mt-2 text-gray-700">{scheme.description}</p>
        </CardHeader>
      </Card>

      <section aria-labelledby="eligibility-table">
        <h2 id="eligibility-table" className="text-3xl font-bold mb-4" style={{ color: '#000080' }}>
          Patrata (Eligibility)
        </h2>
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="bg-gray-50 border-b">
                <td className="p-4 text-xl font-medium text-gray-800">Bharat ka Nagrik</td>
                <td className="p-4 flex justify-end">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="p-4 text-xl font-medium text-gray-800">{scheme.category} Category</td>
                <td className="p-4 flex justify-end">
                   <CheckCircle2 className="w-8 h-8 text-green-600" />
                </td>
              </tr>
              <tr className="bg-gray-50 border-b">
                <td className="p-4 text-xl font-medium text-gray-800">Aay (Income) &lt; 8 Lakhs</td>
                <td className="p-4 flex justify-end">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <span className="ml-2 text-lg text-gray-500 self-center">Yaad Rakhein</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="document-checklist">
        <h2 id="document-checklist" className="text-3xl font-bold mb-4" style={{ color: '#000080' }}>
          Dastavez (Documents Required)
        </h2>

        {!isActiveApp && (
          <div className="mb-6">
            <Button 
              className="py-4 px-8 text-2xl font-bold w-full md:w-auto" 
              style={{ backgroundColor: '#138808', color: 'white' }}
              onClick={handleStart}
            >
              Abhi Apply Karein
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {scheme.requirements.map(req => {
            const docStatus = docs.find(d => d.id === req.id)?.status;
            const isUploaded = docStatus === 'uploaded';
            const isActiveUpload = activeReqId === req.id;

            return (
              <Card 
                key={req.id} 
                className={`transition-all border-l-8 ${isUploaded ? 'bg-green-50' : 'bg-white'}`}
                style={{ borderLeftColor: isUploaded ? '#138808' : '#FF9933' }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {req.label}
                        {isUploaded && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                      </h3>
                      <p className="text-lg text-gray-500">
                        Niyam: {req.format}, Max Size: {req.maxSize}
                      </p>
                    </div>

                    {isActiveApp && !isUploaded && (
                      <Button
                        variant={isActiveUpload ? "default" : "outline"}
                        onClick={() => setActiveReqId(isActiveUpload ? null : req.id)}
                        className={`text-xl py-2 px-6 ${isActiveUpload ? 'text-white' : 'text-gray-800'}`}
                        style={{ backgroundColor: isActiveUpload ? '#000080' : 'transparent', borderColor: '#000080' }}
                      >
                        {isActiveUpload ? 'Band Karein' : 'Upload karein'}
                      </Button>
                    )}
                  </div>

                  {isActiveUpload && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <SmartStepper 
                        requirementDetails={`Zaroori hai: ${req.format} only. Limit: ${req.maxSize}`} 
                        reqId={req.id}
                        onSuccess={() => setActiveReqId(null)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}