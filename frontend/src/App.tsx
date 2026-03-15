import React from 'react';
import { useAppStore } from './store/appStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ViewOverview } from './components/views/ViewOverview';
import { ViewGapBoard } from './components/views/ViewGapBoard';
import { ViewAiAnalysis } from './components/views/ViewAiAnalysis';
import { ViewGamification } from './components/views/ViewGamification';
import { ViewMyGaps } from './components/views/ViewMyGaps';

function App() {
    const { activeView } = useAppStore();

    return (
        <div className="flex bg-background text-foreground h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header />
                <div className="flex-1 p-8 overflow-y-auto">
                    {activeView === 'overview' && <ViewOverview />}
                    {activeView === 'gap_board' && <ViewGapBoard />}
                    {activeView === 'ai_analysis' && <ViewAiAnalysis />}
                    {activeView === 'gamification' && <ViewGamification />}
                    {activeView === 'my_gaps' && <ViewMyGaps />}
                </div>
            </main>
        </div>
    );
}

export default App;
