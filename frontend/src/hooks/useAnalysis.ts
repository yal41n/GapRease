import { useState } from 'react';
import { analysisApi } from '../api/analysis';
import { useAnalysisStore } from '../store/analysisStore';

export function useAnalysis() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setSessionId } = useAnalysisStore();

    const startAnalysis = async (files: File[]) => {
        setIsUploading(true);
        setError(null);
        try {
            const res = await analysisApi.uploadFiles(files);
            setSessionId(res.session_id);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const submitClarification = async (sessionId: string, answers: string[]) => {
        try {
            await analysisApi.submitClarification(sessionId, answers);
        } catch (err: any) {
            console.error("Failed to submit clarification", err);
        }
    };

    return {
        startAnalysis,
        submitClarification,
        isUploading,
        error,
    };
}
