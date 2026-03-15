import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAnalysis } from '../../hooks/useAnalysis';
import { useAnalysisStore } from '../../store/analysisStore';
import { useSSEStream } from '../../hooks/useSSEStream';

export const ViewAiAnalysis = () => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { startAnalysis, isUploading } = useAnalysis();
    const { sessionId } = useAnalysisStore();
    const { events, isDone } = useSSEStream(sessionId);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.length) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFiles(Array.from(e.target.files));
        }
    };

    const runAnalysis = () => {
        if (files.length > 0) {
            startAnalysis(files);
        }
    };

    const progressEvent = events.filter(e => e.type === 'progress').pop();
    const systemEvents = events.filter(e => e.type === 'system' || e.type === 'agent_message');
    const completeEvent = events.find(e => e.type === 'complete');

    return (
        <div className="flex flex-col gap-6">
            <h2 className="m-0 font-bold text-2xl">AI Agent Pipeline</h2>
            <div className="text-muted-foreground mb-4">
                Upload architecture documents, policies, or scan results. Our AI will automatically identify GAPs against selected frameworks.
            </div>

            <div className="flex gap-6 h-[500px]">
                {/* Upload Section */}
                <div className="flex-[0.4] flex flex-col gap-4">
                    <div
                        className="card flex-1 flex flex-col items-center justify-center border-dashed border-2 bg-[#08080C] text-center p-8 transition-colors duration-200 hover:border-primary hover:bg-[#0a0a14] cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <Icons.Upload />
                        <h3 className="mt-4 mb-2 font-semibold">Upload Documents</h3>
                        <p className="text-sm text-muted-foreground mb-2">PDF, DOCX, JSON, or CSV files supported. Max 50MB.</p>
                        {files.length > 0 && (
                            <div className="text-primary text-sm mb-4">
                                {files.length} file(s) selected
                            </div>
                        )}
                        <button
                            className="btn btn-primary w-full mt-4"
                            onClick={(e) => { e.stopPropagation(); runAnalysis(); }}
                            disabled={isUploading || files.length === 0}
                        >
                            {isUploading ? 'Uploading...' : 'Run Analysis'}
                        </button>
                    </div>
                </div>

                {/* Pipeline/Terminal Section */}
                <div className="card flex-[0.6] flex flex-col bg-[#050508] border-[#1C1C2A] overflow-hidden p-0 relative">
                    <div className="bg-[#0A0A10] p-3 border-b border-[#1C1C2A] flex items-center gap-2">
                        <Icons.Cpu />
                        <span className="font-mono text-sm tracking-widest text-[#A78BFA]">GAP_REASONING_ENGINE_V2</span>
                        {sessionId && <span className="ml-auto text-xs text-muted-foreground font-mono">ID: {sessionId.substring(0, 8)}</span>}
                    </div>

                    <div className="p-6 font-mono text-sm leading-relaxed overflow-y-auto flex-1">
                        {!sessionId && (
                            <div className="text-muted-foreground text-center mt-20 italic">
                                Ready for input. Awaiting document upload...
                            </div>
                        )}

                        {sessionId && (
                            <div className="flex flex-col gap-3">
                                {systemEvents.map((ev, idx) => (
                                    <div key={idx} className="flex gap-3 text-[#A78BFA]">
                                        <span className="text-[#4C1D95]">{'>'}</span> {ev.message || (ev as any).content}
                                    </div>
                                ))}

                                {!isDone && (
                                    <div className="flex gap-3 text-primary animate-pulse mt-2">
                                        <span>Processing{progressEvent ? ` (${progressEvent.percent}%)` : '...'}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {isDone && completeEvent && (
                            <div className="flex flex-col gap-4 mt-6 border-t border-[#1C1C2A] pt-4">
                                <div className="text-success flex items-center gap-2">
                                    <Icons.Check /> Analysis Complete
                                </div>
                                <div className="p-4 bg-[rgba(124,58,237,0.1)] rounded border border-[rgba(124,58,237,0.3)] mt-2">
                                    <h4 className="text-primary-glow font-bold mb-2 font-sans tracking-normal">Findings Generated</h4>
                                    <p className="font-sans text-muted-foreground tracking-normal">
                                        Found {completeEvent.findings?.length || 0} GAPs. Review them in the GAP Board.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};
