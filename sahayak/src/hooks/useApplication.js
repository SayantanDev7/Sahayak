// A custom hook to manage the progress percentage and application status dynamically.
import { useProgress } from './useProgress';
import { useNavigate } from 'react-router-dom';

/**
 * useApplication — provides computed helpers on top of ProgressContext
 * for the Dashboard / UserHub page.
 */
export function useApplication() {
  const { progressData, getFirstIncompleteDocIndex } = useProgress();
  const navigate = useNavigate();

  const appProgress = progressData?.progress ?? 0;
  const isComplete = appProgress >= 100;
  const hasActiveApp = !!progressData;

  // Counts
  const totalDocs = progressData?.documents?.length ?? 0;
  const uploadedDocs = progressData?.documents?.filter(d => d.status === 'uploaded').length ?? 0;
  const rejectedDocs = progressData?.documents?.filter(d => d.status === 'rejected').length ?? 0;
  const pendingDocs = totalDocs - uploadedDocs;

  /**
   * Resume — navigates directly to the scheme detail page.
   * The SchemeDetails page will auto-open the first incomplete doc.
   */
  const resumeApplication = () => {
    if (!progressData) return;

    const source = progressData.source || 'central';
    const state = progressData.stateId || '';
    const firstIncomplete = getFirstIncompleteDocIndex();

    navigate(
      `/scheme/${progressData.schemeId}?source=${source}&state=${state}&resumeDoc=${firstIncomplete}`
    );
  };

  return {
    progressData,
    appProgress,
    isComplete,
    hasActiveApp,
    totalDocs,
    uploadedDocs,
    pendingDocs,
    rejectedDocs,
    resumeApplication
  };
}