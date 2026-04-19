import React, { useState, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileType, CheckCircle, Loader2, XCircle, 
  Brain, Sparkles, ChevronDown, Eye, AlertTriangle,
  RefreshCw, Trash2, Download as DownloadIcon 
} from 'lucide-react';
import { uploadDocument as mockUploadDoc } from '../services/docService';
import { verifyDocument } from '../services/aiService';
import { useProgress } from '../hooks/useProgress';
import { useUserSchemes } from '../hooks/useUserSchemes';
import { useLanguage } from '../context/LanguageContext';
import { getTargetSize } from '../utils/documentLimits';
import { forceCompress, formatBytes } from '../utils/compressor';
import { getVerifiedFileName } from '../utils/fileNaming';
import { useAuth } from '../hooks/useAuth';

const STEPS = {
  IDLE: 'idle',
  COMPRESSING: 'compressing',
  UPLOADING: 'uploading',
  VERIFYING_AI: 'verifying_ai',
  VERIFIED: 'verified',
  SIZE_WARNING: 'size_warning',
  REJECTED: 'rejected',
  ERROR: 'error'
};

export function SmartStepper({ requirementDetails, reqId, onSuccess, schemeName, schemeId, schemeReqs }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState(STEPS.IDLE);
  const [rawFile, setRawFile] = useState(null);         
  const [compressedBlob, setCompressedBlob] = useState(null); 
  const [progress, setProgress] = useState(0);
  const [slimProgress, setSlimProgress] = useState(0);
  const [aiResult, setAiResult] = useState(null);
  const [compData, setCompData] = useState(null);        
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const targetSizeKB = useMemo(() => {
    if (schemeReqs?.size) {
      const raw = schemeReqs.size.toLowerCase().trim();
      if (raw.endsWith('mb')) return parseFloat(raw) * 1024;
      if (raw.endsWith('kb')) return parseFloat(raw);
      return parseFloat(raw) || 500;
    }
    return getTargetSize(schemeName, reqId);
  }, [schemeName, reqId, schemeReqs]);

  const targetFormat = schemeReqs?.format || 'PDF';
  
  const { 
    uploadDocument: uploadDocumentToContext, 
    markDocRejected: markDocRejectedInContext,
    resetDocument
  } = useProgress();
  const { updateSchemeDoc } = useUserSchemes();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileClick = () => {
    if (step === STEPS.IDLE || step === STEPS.ERROR || step === STEPS.REJECTED || step === STEPS.SIZE_WARNING) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    e.target.value = '';
    setRawFile(selectedFile);
    await processFile(selectedFile);
  };

  const processFile = async (inputFile) => {
    setStep(STEPS.COMPRESSING);
    setSlimProgress(0);
    setCompData(null);
    setAiResult(null);

    // Guaranteed Compression via Strict Verification Loop
    const result = await forceCompress(inputFile, targetSizeKB, targetFormat, (p) => setSlimProgress(p));
    setSlimProgress(100);

    const meta = {
      originalSize: formatBytes(result.originalSizeBytes),
      originalSizeBytes: result.originalSizeBytes,
      finalSize: formatBytes(result.finalSizeBytes),
      finalSizeBytes: result.finalSizeBytes,
      finalSizeKB: parseFloat((result.finalSizeBytes / 1024).toFixed(1)),
      format: result.format,
      name: inputFile.name,
      sizeOk: result.finalSizeBytes <= (targetSizeKB * 1024),
    };
    setCompData(meta);
    setCompressedBlob(result.file);

    if (!meta.sizeOk) {
      setStep(STEPS.SIZE_WARNING);
      return;
    }

    setStep(STEPS.UPLOADING);
    setProgress(0);
    const uploadInterval = setInterval(() => {
      setProgress(p => (p < 90 ? p + Math.random() * 10 : p));
    }, 150);

    try {
      await mockUploadDoc(result.file, { category: 'Document' });
      clearInterval(uploadInterval);
      setProgress(100);

      setStep(STEPS.VERIFYING_AI);
      const aiRes = await verifyDocument(result.file);
      setAiResult(aiRes);

      if (aiRes.valid) {
        setStep(STEPS.VERIFIED);
        if (reqId) {
          uploadDocumentToContext(reqId, result.file);
          if (schemeName) {
            updateSchemeDoc(schemeName, reqId, 'uploaded', inputFile.name, meta);
          }
        }
        setIsDetailsExpanded(false);
      } else {
        setStep(STEPS.REJECTED);
        if (reqId) {
          markDocRejectedInContext(reqId, aiRes.message);
          updateSchemeDoc(schemeName, reqId, 'rejected');
        }
      }
    } catch (error) {
      clearInterval(uploadInterval);
      setStep(STEPS.ERROR);
    }
  };

  const handlePreview = () => {
    const blob = compressedBlob || rawFile;
    if (blob) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setShowPreview(true);
    }
  };

  const handleDownload = () => {
    const blob = compressedBlob || rawFile;
    if (!blob || !compData) return;
    const docLabel = reqId || 'Document';
    const perfectName = getVerifiedFileName(compData.name, schemeId, user?.displayName || 'Citizen', docLabel, targetFormat);
    const link = document.createElement('a');
    const blobUrl = URL.createObjectURL(blob);
    link.href = blobUrl;
    link.download = perfectName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleDelete = () => {
    resetStepper();
    if (reqId) resetDocument(reqId);
    if (reqId && schemeName) updateSchemeDoc(schemeName, reqId, 'pending', null, null);
  };

  const resetStepper = () => {
    setStep(STEPS.IDLE);
    setRawFile(null);
    setCompressedBlob(null);
    setProgress(0);
    setSlimProgress(0);
    setAiResult(null);
    setCompData(null);
    setIsDetailsExpanded(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-white/5 border border-white/10">
      <AnimatePresence>
        {step === STEPS.COMPRESSING && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${slimProgress}%` }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 h-[3px] bg-[#ccff00] z-10 shadow-[0_0_10px_#ccff00]"
          />
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-lg font-bold flex items-center gap-2 text-gray-200">
              <FileType className="w-5 h-5 text-[#ccff00]" />
              {t.smartStepper.instructions}
            </p>
            <span className="text-xs bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-md border border-[#ccff00]/20 font-mono">
              {targetFormat} · {t.smartStepper.targetSizeInfo.replace('{size}', targetSizeKB)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {requirementDetails || t.smartStepper.defaultRequirement}
          </p>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all min-h-[220px] flex items-center justify-center ${
            step === STEPS.IDLE ? 'border-white/20 bg-white/5 hover:border-[#ccff00]/50 hover:bg-[#ccff00]/5 cursor-pointer' :
            step === STEPS.VERIFIED ? 'border-green-500/30 bg-green-500/5' :
            'border-white/10 bg-white/5'
          }`}
          onClick={handleFileClick}
        >
          <AnimatePresence mode="wait">
            {step === STEPS.IDLE && (
              <motion.div key="idle" className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white/5 rounded-full border border-white/10"><UploadCloud className="w-10 h-10 text-[#ccff00]" /></div>
                <div>
                  <p className="text-xl font-bold text-white">{t.smartStepper.idleTitle}</p>
                  <p className="text-sm text-gray-500 mt-1">{t.smartStepper.idleSubtitle}</p>
                </div>
              </motion.div>
            )}

            {step === STEPS.COMPRESSING && (
              <motion.div key="compressing" className="flex flex-col items-center space-y-5">
                <div className="relative">
                  <Sparkles className="w-12 h-12 text-[#ccff00]" />
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute -inset-2 border-t-2 border-[#ccff00] rounded-full" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#ccff00] tracking-wide">{t.smartStepper.optimizing}</h3>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{Math.round(slimProgress)}% COMPLETE</p>
                </div>
              </motion.div>
            )}

            {step === STEPS.UPLOADING && (
              <motion.div key="uploading" className="flex flex-col items-center space-y-5 w-full max-w-xs">
                <Loader2 className="w-12 h-12 animate-spin text-[#ccff00]" />
                <div className="text-center w-full">
                  <h3 className="text-lg font-bold text-white">{t.smartStepper.uploading}</h3>
                  <div className="w-full bg-white/10 rounded-full h-1 mt-4 overflow-hidden">
                    <motion.div className="h-full bg-[#ccff00]" animate={{ width: `${Math.round(progress)}%` }} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === STEPS.VERIFYING_AI && (
              <motion.div key="verifying" className="flex flex-col items-center space-y-5">
                <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20"><Brain className="w-12 h-12 text-purple-400" /></div>
                <h3 className="text-lg font-bold text-white">{t.smartStepper.aiVerifying}</h3>
              </motion.div>
            )}

            {step === STEPS.VERIFIED && (
              <motion.div key="verified" className="w-full">
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20 relative">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-green-500/20"><CheckCircle className="w-5 h-5 text-green-400" /></div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-white truncate max-w-[150px]">{compData?.name}</span>
                      <span className="text-[10px] text-green-400">{compData?.finalSize} · {compData?.format}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* PROMINENT PREVIEW BUTTON ON ROW */}
                    <button onClick={(e) => { e.stopPropagation(); handlePreview(); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#ccff00] transition-all border border-white/10" title={t.smartStepper.preview}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isDetailsExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-left">
                          <div><p className="text-[10px] text-gray-500 uppercase">{t.smartStepper.originalSize}</p><p className="text-sm text-gray-400 line-through">{compData.originalSize}</p></div>
                          <div><p className="text-[10px] text-[#ccff00] uppercase font-bold">{t.smartStepper.optimizedSize}</p><p className="text-sm font-bold text-[#ccff00]">{compData.finalSize}</p></div>
                          <div><p className="text-[10px] text-gray-500 uppercase">{t.smartStepper.finalFormat}</p><p className="text-sm text-gray-200">{compData.format}</p></div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-lg text-xs font-bold text-[#ccff00] hover:bg-[#ccff00]/20"><DownloadIcon className="w-4 h-4" /> {t.smartStepper.download}</button>
                          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400"><RefreshCw className="w-4 h-4" /></button>
                          <button onClick={handleDelete} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === STEPS.SIZE_WARNING && (
              <motion.div key="sizeWarning" className="flex flex-col items-center space-y-4">
                <div className="rounded-full p-4 bg-orange-500/10 border border-orange-500/20"><AlertTriangle className="w-10 h-10 text-orange-400" /></div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-orange-400">File Too Large</h3>
                  <p className="text-sm text-gray-500">Compressed to {compData?.finalSize} (Target: {targetSizeKB}KB)</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePreview} className="py-2 px-6 rounded-lg font-bold border border-white/10 text-gray-300 hover:bg-white/5 flex items-center gap-2"><Eye className="w-4 h-4" /> {t.smartStepper.preview}</button>
                  <button onClick={resetStepper} className="py-2 px-6 rounded-lg font-bold bg-[#ccff00] text-black hover:bg-[#aacc00]">{t.smartStepper.tryAgain}</button>
                </div>
              </motion.div>
            )}

            {(step === STEPS.REJECTED || step === STEPS.ERROR) && (
              <motion.div key="status" className="flex flex-col items-center space-y-4">
                <div className={`rounded-full p-4 ${step === STEPS.REJECTED ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
                  {step === STEPS.REJECTED ? <XCircle className="w-10 h-10 text-red-400" /> : <FileType className="w-10 h-10 text-orange-400" />}
                </div>
                <h3 className={`text-lg font-bold ${step === STEPS.REJECTED ? 'text-red-400' : 'text-orange-400'}`}>{step === STEPS.REJECTED ? t.smartStepper.reuploadNeeded : t.smartStepper.uploadFailed}</h3>
                <button onClick={resetStepper} className="py-2 px-6 rounded-lg font-bold border border-white/10 text-gray-300 hover:bg-white/5">{t.smartStepper.tryAgain}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-4xl w-full bg-[#111] rounded-2xl border border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2"><Eye className="w-5 h-5 text-[#ccff00]" /> {t.smartStepper.preview}</h3>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/10 rounded-lg"><XCircle className="w-6 h-6 text-gray-500" /></button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto flex items-center justify-center">
                {(compressedBlob || rawFile)?.type?.startsWith('image/') ? <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg" /> : <div className="py-20 text-gray-500">PDF Preview not available in browser. Please download.</div>}
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end">
                <button onClick={() => setShowPreview(false)} className="py-2 px-8 bg-[#ccff00] text-black font-bold rounded-xl">{t.smartStepper.close}</button>
              </div>
            </motion.div>
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
  onSuccess: PropTypes.func,
  schemeName: PropTypes.string,
  schemeId: PropTypes.string,
  schemeReqs: PropTypes.shape({
    format: PropTypes.string,
    size: PropTypes.string,
  }),
};