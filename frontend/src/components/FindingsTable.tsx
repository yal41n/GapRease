import React from 'react';
import { Finding } from '../types/analysis';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FindingsTable({ findings }: { findings: Finding[] }) {
    if (!findings || findings.length === 0) return null;

    // Aggregate by severity
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    findings.forEach(f => {
        const s = f.severity || 'Medium';
        if (s in counts) counts[s as keyof typeof counts]++;
    });

    const chartData = [
        { name: 'Critical', value: counts.Critical, color: '#ef4444' },
        { name: 'High', value: counts.High, color: '#f97316' },
        { name: 'Medium', value: counts.Medium, color: '#eab308' },
        { name: 'Low', value: counts.Low, color: '#3b82f6' },
    ];

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 text-slate-100">Findings Summary</h3>

            <div className="h-64 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" allowDecimals={false} />
                        <Tooltip
                            cursor={{ fill: '#334155' }}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto rounded-md border border-slate-800">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900 border-b border-slate-800">
                        <tr>
                            <th className="px-4 py-3">Severity</th>
                            <th className="px-4 py-3">Domain</th>
                            <th className="px-4 py-3">NIST ID</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Remediation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {findings.map((finding, idx) => (
                            <tr key={idx} className="bg-slate-950 border-b border-slate-800 hover:bg-slate-900/50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${finding.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            finding.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                finding.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {finding.severity || 'Medium'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-300 capitalize">{finding.domain || '-'}</td>
                                <td className="px-4 py-3 font-mono text-xs">{finding.nist_id || '-'}</td>
                                <td className="px-4 py-3 text-slate-400">{finding.gap_description || '-'}</td>
                                <td className="px-4 py-3 text-slate-400">{finding.remediation || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
