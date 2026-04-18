import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileType, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { uploadDocument as mockUploadDoc } from '../services/docService';
import { toast } from 'react-toastify';
import { useProgress } from '../hooks/useProgress';

const STEPS = {
  IDLE: 'idle',
  CHECKING: 'checking',
  COMPRESSING: 'compressing',
  SUCCESS: 'success',
  ERROR: 'error'
};

export function SmartStepper({ requirementDetails, reqId, onSuccess }) {
  const [step, setStep] = useState(STEPS.IDLE);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // Safe invoke the hook
  let uploadDocumentToContext = () => {};
  try {
    const context = useProgress();
    if(context && context.uploadDocument) {
      uploadDocumentToContext = context.uploadDocument;
    }
  // eslint-disable-next-line no-empty
  } catch (e) {}

  const handleFileClick = () => {
    if (step === STEPS.IDLE || step === STEPS.ERROR) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile) => {
    setStep(STEPS.CHECKING);
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress(p => (p < 95 ? p + 5 : p));
    }, 200);

    try {
      // Mock checking compliance state
      await new Promise(r => setTimeout(r, 1500));
      setStep(STEPS.COMPRESSING);
      
      // Real or mocked upload service
      await mockUploadDoc(selectedFile, { category: 'Document' });
      clearInterval(uploadInterval);
      
      setStep(STEPS.SUCCESS);
      setProgress(100);
      toast.success("Mubarak ho! Aapka document upload ho gaya.");
      
      if (reqId) {
        uploadDocumentToContext(reqId, selectedFile);
      }
      
      if (onSuccess) {
         setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      clearInterval(uploadInterval);
      setStep(STEPS.ERROR);
      toast.error(error?.message || "Kuch galat ho gaya.");
    }
  };

  const resetStepper = () => {
    setStep(STEPS.IDLE);
    setFile(null);
    setProgress(0);
  };

  const getBorderColor = () => {
    if (step === STEPS.IDLE) return '#FF9933';
    if (step === STEPS.SUCCESS) return '#138808';
    if (step === STEPS.ERROR) return '#EF4444'; 
    return '#E5E7EB';
  };

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <p className="text-xl font-bold flex items-center gap-2" style={{ color: '#000080' }}>
          <FileType className="w-6 h-6" style={{ color: '#FF9933' }} />
          Nirdesh (Instructions)
        </p>
        <p className="text-lg text-gray-700 font-medium">
          {requirementDetails || 'Upload your Aadhaar, PAN, or other ID.'}
        </p>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <div
          className="border-4 border-dashed rounded-xl p-8 text-center transition-colors shadow-inner"
          style={{
            cursor: step === STEPS.IDLE || step === STEPS.ERROR ? 'pointer' : 'default',
            borderColor: getBorderColor(),
            backgroundColor: step === STEPS.IDLE ? '#FFF3E0' : step === STEPS.SUCCESS ? '#e6f4ea' : '#ffffff'
          }}
          onClick={handleFileClick}
        >
          <AnimatePresence mode="wait">
            
            {/* IDLE */}
            {step === STEPS.IDLE && (
              <motion.div key="idle" className="flex flex-col items-center space-y-4">
                <div className="p-5 bg-white rounded-full shadow-sm">
                  <UploadCloud className="w-12 h-12" style={{ color: '#FF9933' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#000080' }}>
                    Aap photo khicho, size hum theek karenge
                  </p>
                  <p className="text-lg text-gray-500 mt-2">
                    Click here to begin upload
                  </p>
                </div>
                <Button variant="outline" className="text-lg py-2 px-6" onClick={(e) => { e.stopPropagation(); handleFileClick(); }}>
                  File Chune
                </Button>
              </motion.div>
            )}

            {/* PROCESSING (Checking / Compressing) */}
            {(step === STEPS.CHECKING || step === STEPS.COMPRESSING) && (
              <motion.div key="processing" className="flex flex-col items-center space-y-6">
                <Loader2 className="w-16 h-16 animate-spin" style={{ color: '#FF9933' }} />
                <div className="text-center">
                  <h3 className="text-2xl font-bold" style={{ color: '#000080' }}>
                    {step === STEPS.CHECKING ? 'Checking document compliance...' : 'Compressing and converting to format...'}
                  </h3>
                  <p className="text-lg text-gray-600 mt-2 line-clamp-1 max-w-xs mx-auto">{file?.name}</p>
                </div>
                <div className="w-full max-w-sm bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#FF9933' }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === STEPS.SUCCESS && (
              <motion.div key="success" className="flex flex-col items-center space-y-4">
                <div className="rounded-full p-3 text-white" style={{ backgroundColor: '#138808' }}>
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold" style={{ color: '#138808' }}>
                    Ready for Submission!
                  </h3>
                  <p className="text-lg text-gray-600 mt-1">
                    {file?.name} uploaded successfully. Preview available.
                  </p>
                </div>
                <Button variant="outline" className="text-lg py-2 px-6" onClick={(e) => { e.stopPropagation(); resetStepper(); }}>
                  Upload Another File
                </Button>
              </motion.div>
            )}

            {/* ERROR */}
            {step === STEPS.ERROR && (
              <motion.div key="error" className="flex flex-col items-center space-y-4">
                <div className="rounded-full p-3 text-white bg-red-600">
                  <FileType className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-red-600">
                    Upload Failed
                  </h3>
                  <p className="text-lg text-gray-600 mt-1">
                    Format ya size niyam anusar nahi hai.
                  </p>
                </div>
                <Button variant="outline" className="text-lg py-2 px-6" onClick={(e) => { e.stopPropagation(); resetStepper(); }}>
                  Firse Try Karein
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

SmartStepper.propTypes = {
  requirementDetails: PropTypes.string,
  reqId: PropTypes.string,
  onSuccess: PropTypes.func
};