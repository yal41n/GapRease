import { create } from 'zustand';
import { GAPS } from './mockData';

interface AppState {
    activeView: string;
    setActiveView: (view: string) => void;
    gaps: typeof GAPS;
    setGaps: (gaps: typeof GAPS) => void;
    addGaps: (gaps: typeof GAPS) => void;
    resolveGap: (id: string) => void;
    assignGap: (id: string, assignedTo: string) => void;
    token: string | null;
    isAuthenticated: boolean;
    requiresPasswordChange: boolean;
    setAuth: (token: string | null, requiresChange: boolean) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    activeView: 'overview',
    setActiveView: (view) => set({ activeView: view }),
    gaps: [] as typeof GAPS,
    setGaps: (newGaps) => set({ gaps: newGaps }),
    addGaps: (newGaps) => set((state) => ({ gaps: [...newGaps, ...state.gaps] })),
    resolveGap: (id) => set((state) => ({
        gaps: state.gaps.map((g) => g.id === id ? { ...g, status: 'resolved' } : g)
    })),
    assignGap: (id, assignedTo) => set((state) => ({
        gaps: state.gaps.map((g) => g.id === id ? { ...g, assignedTo } : g)
    })),

    token: localStorage.getItem('gap_token'),
    isAuthenticated: !!localStorage.getItem('gap_token'),
    requiresPasswordChange: false,
    setAuth: (token: string | null, requiresChange: boolean) => {
        if (token) localStorage.setItem('gap_token', token);
        else localStorage.removeItem('gap_token');
        set({ token, isAuthenticated: !!token, requiresPasswordChange: requiresChange });
    },
    logout: () => {
        localStorage.removeItem('gap_token');
        set({ token: null, isAuthenticated: false, requiresPasswordChange: false, activeView: 'overview' });
    }
}));
