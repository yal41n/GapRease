import React, { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';

export function ClarifierPrompt({ session_id, questions }: { session_id: string, questions: string[] }) {
    const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
    const [submitted, setSubmitted] = useState(false);
    const { submitClarification } = useAnalysis();

    const handleSubmit = async () => {
        setSubmitted(true);
        await submitClarification(session_id, answers);
    };

    if (submitted) {
        return (
            <div className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg mx-4 my-2">
                <div className="text-sm text-slate-400 italic">Clarification submitted. Resuming pipeline...</div>
            </div>
        );
    }

    return (
        <div className="px-5 py-4 bg-purple-950/20 border-2 border-purple-500/30 rounded-lg mx-4 my-3 shadow-lg shadow-purple-900/10">
            <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded text-xs font-semibold text-white bg-amber-500">Clarifier</span>
                <span className="text-sm font-medium text-purple-200">Missing Information Detected</span>
            </div>

            <p className="text-sm text-slate-300 mb-4">
                The As-Is Auditor or Technical Manager detected gaps in the provided documentation. Please clarify the following:
            </p>

            <div className="space-y-4 mb-4">
                {questions.map((q, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <label className="block text-sm font-medium text-purple-100">{q}</label>
                        <input
                            type="text"
                            value={answers[idx]}
                            onChange={(e) => {
                                const newAns = [...answers];
                                newAns[idx] = e.target.value;
                                setAnswers(newAns);
                            }}
                            placeholder="Enter clarification..."
                            className="w-full bg-slate-950 border border-purple-900/50 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 outline-none placeholder:text-slate-600"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={answers.some(a => !a.trim())}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors shadow-md shadow-purple-900/20"
            >
                Submit Answers & Resume
            </button>
        </div>
    );
}
