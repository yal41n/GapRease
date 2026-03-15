import React, { useEffect, useRef, useState } from 'react';
import { useAnalysisStore } from '../store/analysisStore';
import { useSSEStream } from '../hooks/useSSEStream';
import { AgentMessage } from './AgentMessage';
import { ClarifierPrompt } from './ClarifierPrompt';
import { ReportPreview } from './ReportPreview';
import { CheckCircle2, Download } from 'lucide-react';

export function StreamPanel() {
    const { sessionId } = useAnalysisStore();
    const { events, isConnecting, isDone } = useSSEStream(sessionId);
    const endRef = useRef<HTMLDivElement>(null);
    const [showReport, setShowReport] = useState(false);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    const progressEvent = events.filter(e => e.type === 'progress').pop();
    const completeEvent = events.find(e => e.type === 'complete');

    if (!sessionId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
                <div className="w-16 h-16 rounded-full border-t-2 border-slate-800 animate-spin mb-4"></div>
                <p>Awaiting evidence upload...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-950 h-full relative">
            <div className="flex-1 overflow-y-auto py-6">
                {events.map((ev, i) => {
                    if (ev.type === 'system' || ev.type === 'agent_message' || ev.type === 'error') {
                        return <AgentMessage key={i} event={ev} />;
                    }
                    if (ev.type === 'clarification_required' && ev.session_id && ev.questions) {
                        return <ClarifierPrompt key={i} session_id={ev.session_id} questions={ev.questions} />;
                    }
                    return null;
                })}

                {progressEvent && !isDone && (
                    <div className="px-4 py-2 mx-4 my-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>{progressEvent.label}</span>
                            <span>{progressEvent.percent}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${progressEvent.percent}%` }}
                            />
                        </div>
                    </div>
                )}

                {isDone && completeEvent && !showReport && (
                    <div className="px-5 py-6 bg-green-950/20 border border-green-900/50 rounded-lg mx-4 my-6 text-center animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-green-400 mb-1">Analysis Complete</h3>
                        <p className="text-sm text-slate-400 mb-6">Generated {completeEvent.findings?.length || 0} findings mapped to framework.</p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    const blob = new Blob([JSON.stringify(completeEvent.findings, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `cybersec-findings-${sessionId}.json`;
                                    a.click();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md text-sm font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" /> Export JSON
                            </button>
                            <button
                                onClick={() => setShowReport(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors shadow-md shadow-blue-900/20"
                            >
                                Preview Report
                            </button>
                        </div>
                    </div>
                )}

                {showReport && completeEvent && (
                    <ReportPreview markdown={completeEvent.report_markdown || ''} onBack={() => setShowReport(false)} />
                )}

                <div ref={endRef} className="h-4" />
            </div>
        </div>
    );
}
