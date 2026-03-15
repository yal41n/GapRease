import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

export function ReportPreview({ markdown, onBack }: { markdown: string, onBack: () => void }) {
    return (
        <div className="bg-slate-950 min-h-full">
            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center gap-4 z-10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">Final Compliance Report</h2>
            </div>

            <div className="p-8 max-w-4xl mx-auto prose prose-invert prose-blue prose-headings:font-bold prose-a:text-blue-400">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
        </div>
    );
}
