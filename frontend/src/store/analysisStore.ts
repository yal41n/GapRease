import { create } from 'zustand';
import { AnalysisSession } from '../types/analysis';

interface AnalysisStore {
    sessionId: string | null;
    setSessionId: (id: string | null) => void;
    activeSession: AnalysisSession | null;
    setActiveSession: (session: AnalysisSession | null) => void;
    framework: string;
    setFramework: (fw: string) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
    sessionId: null,
    setSessionId: (id) => set({ sessionId: id }),
    activeSession: null,
    setActiveSession: (session) => set({ activeSession: session }),
    framework: 'NIST CSF 2.0',
    setFramework: (fw) => set({ framework: fw }),
}));
