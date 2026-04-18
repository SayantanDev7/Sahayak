import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileType, CheckCircle, Loader2, XCircle, Brain } from 'lucide-react';
import { uploadDocument as mockUploadDoc } from '../services/docService';
import { verifyDocument } from '../services/aiService';
import { useProgress } from '../hooks/useProgress';
import { useLanguage } from '../context/LanguageContext';

const STEPS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  VERIFYING_AI: 'verifying_ai',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  ERROR: 'error'
};

export function SmartStepper({ requirementDetails, reqId, onSuccess }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(STEPS.IDLE);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [aiResult, setAiResult] = useState(null);
  const fileInputRef = useRef(null);
  
  let uploadDocumentToContext = () => {};
  let markDocRejectedInContext = () => {};
  try {
    const context = useProgress();
    if (context?.uploadDocument) uploadDocumentToContext = context.uploadDocument;
    if (context?.markDocRejected) markDocRejectedInContext = context.markDocRejected;
  // eslint-disable-next-line no-empty
  } catch (e) {}

  const handleFileClick = () => {
    if (step === STEPS.IDLE || step === STEPS.ERROR || step === STEPS.REJECTED) {
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
    // Phase 1: Uploading
    setStep(STEPS.UPLOADING);
    setProgress(0);
    setAiResult(null);

    const uploadInterval = setInterval(() => {
      setProgress(p => (p < 90 ? p + Math.random() * 8 : p));
    }, 200);

    try {
      await mockUploadDoc(selectedFile, { category: 'Document' });
      clearInterval(uploadInterval);
      setProgress(100);

      // Phase 2: AI Verification
      setStep(STEPS.VERIFYING_AI);

      const result = await verifyDocument(selectedFile);
      setAiResult(result);

      if (result.valid) {
        setStep(STEPS.VERIFIED);
        if (reqId) uploadDocumentToContext(reqId, selectedFile);
        if (onSuccess) setTimeout(onSuccess, 2000);
      } else {
        setStep(STEPS.REJECTED);
        if (reqId) markDocRejectedInContext(reqId, result.message);
      }
    } catch (error) {
      clearInterval(uploadInterval);
      setStep(STEPS.ERROR);
    }
  };

  const resetStepper = () => {
    setStep(STEPS.IDLE);
    setFile(null);
    setProgress(0);
    setAiResult(null);
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <p className="text-lg font-bold flex items-center gap-2 text-gray-300">
          <FileType className="w-5 h-5 text-[#ccff00]" />
          {t.smartStepper.instructions}
        </p>
        <p className="text-base text-gray-500">
          {requirementDetails || t.smartStepper.defaultRequirement}
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          step === STEPS.IDLE ? 'border-white/20 bg-white/5 hover:border-[#ccff00]/50 hover:bg-[#ccff00]/5 cursor-pointer' :
          step === STEPS.VERIFIED ? 'border-green-500/50 bg-green-500/5' :
          step === STEPS.REJECTED ? 'border-red-500/50 bg-red-500/5 cursor-pointer' :
          step === STEPS.ERROR ? 'border-red-500/50 bg-red-500/5 cursor-pointer' :
          'border-white/10 bg-white/5'
        }`}
        onClick={handleFileClick}
      >
        <AnimatePresence mode="wait">
          
          {/* IDLE */}
          {step === STEPS.IDLE && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-white/10 rounded-full">
                <UploadCloud className="w-10 h-10 text-[#ccff00]" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">
                  {t.smartStepper.idleTitle}
                </p>
                <p className="text-base text-gray-500 mt-1">
                  {t.smartStepper.idleSubtitle}
                </p>
              </div>
              <button
                className="text-base py-2 px-6 rounded-lg font-bold border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); handleFileClick(); }}
              >
                {t.smartStepper.chooseFile}
              </button>
            </motion.div>
          )}

          {/* UPLOADING */}
          {step === STEPS.UPLOADING && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center space-y-5"
            >
              <Loader2 className="w-12 h-12 animate-spin text-[#ccff00]" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  {t.smartStepper.uploading}
                </h3>
                <p className="text-base text-gray-500 mt-1 truncate max-w-xs mx-auto">{file?.name}</p>
              </div>
              <div className="w-full max-w-sm bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#ccff00]"
                  animate={{ width: `${Math.round(progress)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
            </motion.div>
          )}

          {/* AI VERIFICATION */}
          {step === STEPS.VERIFYING_AI && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center space-y-5"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="p-4 bg-purple-500/20 rounded-full"
              >
                <Brain className="w-12 h-12 text-purple-400" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  {t.smartStepper.aiVerifying}
                </h3>
                <p className="text-base text-gray-500 mt-1">
                  {t.smartStepper.aiSubtitle}
                </p>
              </div>
              <motion.div
                className="flex gap-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-purple-400" />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* VERIFIED */}
          {step === STEPS.VERIFIED && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="rounded-full p-4 bg-green-500/20">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-400">
                  {t.smartStepper.verified}
                </h3>
                <p className="text-base text-gray-400 mt-1">
                  {aiResult?.message || t.smartStepper.verifiedDefault}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {file?.name}
                </p>
              </div>
              <button
                className="text-base py-2 px-6 rounded-lg font-bold border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); resetStepper(); }}
              >
                {t.smartStepper.uploadAnother}
              </button>
            </motion.div>
          )}

          {/* REJECTED */}
          {step === STEPS.REJECTED && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="rounded-full p-4 bg-red-500/20">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-400">
                  {t.smartStepper.reuploadNeeded}
                </h3>
                <p className="text-base text-gray-400 mt-1">
                  {aiResult?.message || t.smartStepper.rejectedDefault}
                </p>
              </div>
              <button
                className="text-base py-2 px-6 rounded-lg font-bold bg-[#ccff00] text-black hover:bg-[#aacc00] transition-colors"
                onClick={(e) => { e.stopPropagation(); resetStepper(); }}
              >
                {t.smartStepper.tryAgain}
              </button>
            </motion.div>
          )}

          {/* ERROR */}
          {step === STEPS.ERROR && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="rounded-full p-4 bg-red-500/20">
                <FileType className="w-10 h-10 text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-400">
                  {t.smartStepper.uploadFailed}
                </h3>
                <p className="text-base text-gray-400 mt-1">
                  {t.smartStepper.networkError}
                </p>
              </div>
              <button
                className="text-base py-2 px-6 rounded-lg font-bold border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); resetStepper(); }}
              >
                {t.smartStepper.retryUpload}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

SmartStepper.propTypes = {
  requirementDetails: PropTypes.string,
  reqId: PropTypes.string,
  onSuccess: PropTypes.func
};