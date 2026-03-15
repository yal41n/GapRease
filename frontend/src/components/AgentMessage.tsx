import React from 'react';
import { SSEEvent } from '../types/stream';

const AGENT_COLORS: Record<string, string> = {
    'CISO Orchestrator': 'bg-purple-600',
    'AsIs Auditor': 'bg-teal-600',
    'Clarifier': 'bg-amber-500',
    'CyberSec Manager': 'bg-blue-600',
    'AppSec': 'bg-red-600',
    'Network Security': 'bg-orange-500',
    'GRC Auditor': 'bg-green-600',
};

export function AgentMessage({ event }: { event: SSEEvent }) {
    const badgeColor = event.agent ? AGENT_COLORS[event.agent] || 'bg-slate-600' : 'bg-slate-600';

    if (event.type === 'system') {
        return (
            <div className="px-4 py-2 text-sm text-slate-500 italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                {event.message}
            </div>
        );
    }

    if (event.type === 'error') {
        return (
            <div className="px-4 py-3 bg-red-950/30 border border-red-900/50 text-red-400 rounded-md text-sm mx-4 my-2">
                <strong className="block mb-1">Pipeline Error</strong>
                {event.message}
            </div>
        );
    }

    return (
        <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg mx-4 my-2 group hover:bg-slate-900 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                {event.agent && (
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white shadow-sm ${badgeColor}`}>
                        {event.agent}
                    </span>
                )}
                {event.confidence !== undefined && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded border ${event.confidence > 0.8 ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                            event.confidence > 0.5 ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                                'border-red-500/30 text-red-400 bg-red-500/10'
                        }`}>
                        {Math.round(event.confidence * 100)}% Conf.
                    </span>
                )}
            </div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {event.message}
            </div>
        </div>
    );
}
