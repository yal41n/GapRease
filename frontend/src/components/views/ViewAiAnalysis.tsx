import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../Icons';
import { useAppStore } from '../../store/appStore';

export const ViewAiAnalysis = () => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simStep, setSimStep] = useState(0);
    const [isWaitingForClarification, setIsWaitingForClarification] = useState(false);
    const [clarificationInput, setClarificationInput] = useState('');
    const [selectedFramework, setSelectedFramework] = useState('NIST CSF 2.0');

    const endRef = useRef<HTMLDivElement>(null);
    const { setActiveView, addGaps } = useAppStore();

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [simStep, isWaitingForClarification]);

    const simulationSteps = [
        "[CISO Orchestrator] Initializing analysis sequence for uploaded documents...",
        `[CISO Orchestrator] Target Framework: ${selectedFramework}`,
        "[CISO Orchestrator] Sending document payload to AsIs Auditor...",
        "[AsIs Auditor] Analyzing document structure and extracting key entities...",
        "[AsIs Auditor] Current State Summary: Hybrid cloud architecture with remote VPN access points. Returning summary.",
        "[CISO Orchestrator] Passing Current State Summary to CyberSec Manager...",
        "[CyberSec Manager] Evaluating summary. Splitting workload across specialized agents:",
        "  -> [AppSec Agent] Checking software findings and CI/CD pipelines...",
        "  -> [NetSec Agent] Checking infrastructure routing and firewall rules...",
        "  -> [GRC Agent] Ensuring findings map to " + selectedFramework + " IDs...",
        "[NetSec Agent] WARNING: Detected ambiguous firewall rule for subnet 10.0.4.0/24.",
        "[Clarifier] HOLD: Manual clarification required to proceed.",
        // -- CLARIFIER INTERRUPT HAPPENS HERE (Index 12) --
        "[Clarifier] Received input. Resolving ambiguity and resuming NetSec flow...",
        "  -> [NetSec Agent] Confirming rule maps to unauthorized shadow IT. GAP identified.",
        "[AppSec Agent] Analysis complete. 0 critical findings.",
        "[GRC Agent] Analysis complete. 3 findings successfully mapped to " + selectedFramework + ".",
        "[CyberSec Manager] Aggregating multi-agent findings. Passing to CISO Orchestrator...",
        "[CISO Orchestrator] Compiling final Markdown report and pushing data via SSE stream..."
    ];

    const runSimulation = () => {
        setIsSimulating(true);
        setSimStep(0);
        setIsWaitingForClarification(false);
        setClarificationInput('');

        let step = 0;
        const advanceStep = () => {
            step++;
            if (step === 12) {
                // Pause for clarification
                setSimStep(step);
                setIsWaitingForClarification(true);
                return;
            }
            if (step >= simulationSteps.length) {
                setSimStep(step);
                setTimeout(() => setIsSimulating(false), 1000);
                return;
            }
            setSimStep(step);
            setTimeout(advanceStep, Math.random() * 800 + 400); // Random delay 400-1200ms
        };
        setTimeout(advanceStep, 600);
    };

    const submitClarification = (e: React.FormEvent) => {
        e.preventDefault();
        setIsWaitingForClarification(false);

        let step = simStep;
        const resumeStep = () => {
            step++;
            if (step >= simulationSteps.length) {
                setSimStep(step);
                setTimeout(() => setIsSimulating(false), 1000);
                return;
            }
            setSimStep(step);
            setTimeout(resumeStep, Math.random() * 800 + 400);
        };
        setTimeout(resumeStep, 500);
    };

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

    const hasStarted = simStep > 0 || isSimulating;
    const isDone = !isSimulating && simStep >= simulationSteps.length;

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="m-0 font-bold text-2xl">AI Agent Pipeline</h2>
                    <div className="text-muted-foreground mt-1">
                        Upload architecture documents to trigger the multi-agent reasoning flow.
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-surface p-2 pr-4 rounded-xl border border-border">
                    <div className="bg-[#1C1C2A] p-2 rounded-lg text-primary"><Icons.Shield /></div>
                    <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Target Framework</div>
                        <select
                            className="bg-transparent border-none text-white font-semibold outline-none cursor-pointer appearance-none"
                            value={selectedFramework}
                            onChange={(e) => setSelectedFramework(e.target.value)}
                            disabled={hasStarted && !isDone}
                        >
                            <option>NIST CSF 2.0</option>
                            <option>ISO 27001:2022</option>
                            <option>CIS Controls v8</option>
                            <option>SOC 2 Type II</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-[500px]">
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
                        <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, JSON, or CSV files supported. Max 50MB.</p>
                        {files.length > 0 && (
                            <div className="px-4 py-2 bg-primary/20 text-primary-glow font-bold rounded-lg mb-4 border border-primary/30">
                                {files.length} file(s) primed for analysis
                            </div>
                        )}
                        <button
                            className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
                            onClick={(e) => { e.stopPropagation(); runSimulation(); }}
                            disabled={(isSimulating && !isWaitingForClarification) || files.length === 0}
                        >
                            {isSimulating && !isWaitingForClarification ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-t-2 border-white animate-spin"></div>
                                    Agents Processing...
                                </>
                            ) : isWaitingForClarification ? 'Awaiting Input...' : 'Run Agentic Analysis'}
                        </button>
                    </div>
                </div>

                {/* Pipeline/Terminal Section */}
                <div className="card flex-[0.6] flex flex-col bg-[#050508] border-[#1C1C2A] overflow-hidden p-0 relative shadow-2xl">
                    <div className="bg-[#0A0A10] p-3 border-b border-[#1C1C2A] flex items-center gap-2">
                        <Icons.Cpu />
                        <span className="font-mono text-sm tracking-widest text-primary-glow">ORCHESTRATOR_LOGS</span>
                        {hasStarted && !isDone && !isWaitingForClarification && <span className="ml-auto text-xs text-muted-foreground font-mono animate-pulse text-green-400 font-bold">● ACTIVE</span>}
                        {isWaitingForClarification && <span className="ml-auto text-xs font-mono animate-pulse text-warning font-bold">● INTERRUPT</span>}
                        {isDone && <span className="ml-auto text-xs font-mono text-muted-foreground font-bold">IDLE</span>}
                    </div>

                    <div className="p-6 font-mono text-sm leading-relaxed overflow-y-auto flex-1 custom-scrollbar">
                        {!hasStarted && (
                            <div className="text-muted-foreground text-center mt-32 italic">
                                System initialized. Select framework and upload documents to begin.
                            </div>
                        )}

                        {hasStarted && (
                            <div className="flex flex-col gap-3 pb-8">
                                {simulationSteps.slice(0, simStep + 1).map((step, idx) => {
                                    // Syntax highlighting for logs
                                    let colorStr = 'text-[#A78BFA]';
                                    if (step.includes('[AsIs Auditor]')) colorStr = 'text-blue-400';
                                    if (step.includes('[CyberSec Manager]')) colorStr = 'text-green-400';
                                    if (step.includes('[AppSec Agent]') || step.includes('[NetSec Agent]') || step.includes('[GRC Agent]')) colorStr = 'text-teal-300';
                                    if (step.includes('WARNING') || step.includes('[Clarifier]')) colorStr = 'text-warning font-bold';

                                    return (
                                        <div key={idx} className={`flex gap-3 animate-in slide-in-from-left-2 fade-in ${colorStr}`}>
                                            <span className="text-muted-foreground shrink-0">{'>'}</span>
                                            <span className="break-words">{step}</span>
                                        </div>
                                    );
                                })}

                                {isWaitingForClarification && (
                                    <div className="mt-4 p-4 border border-warning/30 bg-warning/5 rounded-lg animate-in fade-in zoom-in duration-300">
                                        <div className="text-warning font-bold flex items-center gap-2 mb-2">
                                            <Icons.Shield /> Clarifier Agent Needs Input
                                        </div>
                                        <div className="text-muted-foreground mb-4">
                                            "I cannot determine if the 10.0.4.0/24 subnet is used for guest Wi-Fi or internal POS systems based on the diagram. Please clarify its purpose so I can generate accurate GAP findings."
                                        </div>
                                        <form onSubmit={submitClarification} className="flex gap-2">
                                            <input
                                                autoFocus
                                                required
                                                type="text"
                                                className="input flex-1 bg-black/50 border-warning/20 focus:border-warning"
                                                placeholder="e.g. It is used for external contractor VPN access..."
                                                value={clarificationInput}
                                                onChange={e => setClarificationInput(e.target.value)}
                                            />
                                            <button type="submit" className="btn bg-warning text-black hover:bg-yellow-500 border-none font-bold">Reply & Resume</button>
                                        </form>
                                    </div>
                                )}

                                {isSimulating && !isWaitingForClarification && (
                                    <div className="flex gap-3 text-primary animate-pulse mt-2">
                                        <span className="text-muted-foreground">{'>'}</span> Processing logic gates...
                                    </div>
                                )}
                            </div>
                        )}

                        {isDone && (
                            <div className="flex flex-col gap-4 mt-6 border-t border-[#1C1C2A] pt-6 animate-in fade-in zoom-in duration-500">
                                <div className="text-success flex items-center gap-2 font-sans font-bold text-lg">
                                    <Icons.Check /> Agent Swarm Execution Complete
                                </div>
                                <div className="p-5 bg-[rgba(124,58,237,0.05)] rounded-xl border border-[rgba(124,58,237,0.2)] mt-2 shadow-[0_0_30px_rgba(124,58,237,0.05)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-primary-glow font-bold font-sans tracking-normal m-0 text-lg">Structured Findings Payload</h4>
                                        <span className="bg-primary/20 text-primary-glow text-xs px-2 py-1 rounded font-bold uppercase">{selectedFramework} Mode</span>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-6">
                                        {[
                                            { id: `GAP-NEW-${Date.now()}-1`, title: 'VPN Endpoint Lacks MFA Enforcement', domain: 'Network Architecture', status: 'open', severity: 'critical', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], description: `The external VPN gateway configuration does not require MFA, violating ${selectedFramework} identity requirements.` },
                                            { id: `GAP-NEW-${Date.now()}-2`, title: 'Unencrypted S3 Bucket in Architecture', domain: 'Data Protection', status: 'open', severity: 'high', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], description: `Internal storage bucket used for log aggregation lacks at-rest encryption, a key ${selectedFramework} control.` },
                                            { id: `GAP-NEW-${Date.now()}-3`, title: 'Clarified: Ambiguous Subnet Routing', domain: 'Network Security', status: 'open', severity: 'medium', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], description: `Contractor VPN subnet (10.0.4.0/24) has overly permissive routing to internal LAN based on user clarification, violating ${selectedFramework} segmentation principles.` }
                                        ].map(gap => (
                                            <div key={gap.id} className="p-3 bg-[#0A0A10] border border-[#1C1C2A] rounded-lg text-left shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <strong className="text-white text-sm font-sans">{gap.title}</strong>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${gap.severity === 'critical' ? 'bg-[rgba(239,68,68,0.2)] text-destructive' : gap.severity === 'high' ? 'bg-[rgba(245,158,11,0.2)] text-warning' : 'bg-blue-500/20 text-blue-400'}`}>{gap.severity}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground font-sans leading-relaxed">{gap.description}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="btn btn-primary w-full py-3 text-base shadow-[0_0_20px_rgba(124,58,237,0.3)] font-bold transition-transform hover:scale-[1.02]"
                                        onClick={() => {
                                            const newFindings = [
                                                { id: `GAP-NEW-${Date.now()}-1`, title: 'VPN Endpoint Lacks MFA Enforcement', domain: 'Network Architecture', status: 'open', severity: 'critical', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], description: `The external VPN gateway configuration does not require MFA, violating ${selectedFramework} identity requirements.` },
                                                { id: `GAP-NEW-${Date.now()}-2`, title: 'Unencrypted S3 Bucket in Architecture', domain: 'Data Protection', status: 'open', severity: 'high', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], description: `Internal storage bucket used for log aggregation lacks at-rest encryption, a key ${selectedFramework} control.` },
                                                { id: `GAP-NEW-${Date.now()}-3`, title: 'Clarified: Ambiguous Subnet Routing', domain: 'Network Security', status: 'open', severity: 'medium', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], description: `Contractor VPN subnet (10.0.4.0/24) has overly permissive routing to internal LAN based on user clarification, violating ${selectedFramework} segmentation principles.` }
                                            ];
                                            addGaps(newFindings as any);
                                            setActiveView('gap_board');
                                        }}
                                    >
                                        Import Findings to GBoard
                                    </button>
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
