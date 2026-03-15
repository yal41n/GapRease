import { create } from 'zustand';
import { GAPS } from './mockData';

interface AppState {
    activeView: string;
    setActiveView: (view: string) => void;
    gaps: typeof GAPS;
    setGaps: (gaps: typeof GAPS) => void;
    resolveGap: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    activeView: 'overview',
    setActiveView: (view) => set({ activeView: view }),
    gaps: GAPS,
    setGaps: (newGaps) => set({ gaps: newGaps }),
    resolveGap: (id) => set((state) => ({
        gaps: state.gaps.map((g) => g.id === id ? { ...g, status: 'resolved' } : g)
    })),
}));
