import React, { useState } from 'react';
import { GAPS, LEADERBOARD } from '../../store/mockData';
import { Badge, getSeverityColor, getStatusColor } from '../Badge';
import { Icons } from '../Icons';

export const ViewGamification = () => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [filterDomain, setFilterDomain] = useState('All');
    const [selectedGap, setSelectedGap] = useState<any>(null);

    const filteredGaps = GAPS.filter(g => {
        if (filterStatus !== 'All' && g.status !== filterStatus) return false;
        if (filterSeverity !== 'All' && g.severity !== filterSeverity) return false;
        if (filterDomain !== 'All' && g.domain !== filterDomain) return false;
        return true;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="m-0 font-bold text-2xl">GBoard</h2>
                    <div className="text-warning text-sm font-semibold mt-2 px-3 py-1 bg-[rgba(245,158,11,0.1)] inline-block rounded-md border border-[rgba(245,158,11,0.2)]">
                        Note: This feature is in development and not fully usable yet.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                {LEADERBOARD.slice(0, 3).map((user, index) => (
                    <div key={user.id} className={`p-6 rounded-card border flex flex-col items-center justify-center text-center relative overflow-hidden ${index === 0 ? 'bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.1)] min-h-[160px]' : 'bg-surface border-border min-h-[140px]'}`}>
                        {index === 0 && (
                            <div className="absolute top-0 right-0 p-2 text-warning opacity-20">
                                <Icons.Trophy size={64} />
                            </div>
                        )}
                        <div className={`text-sm font-bold tracking-widest uppercase mb-2 ${index === 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                            {index === 0 ? '👑 King of the Hill' : `#${index + 1} Performer`}
                        </div>
                        <div className="text-xl font-bold">{user.name} <span className="text-sm font-normal text-muted-foreground">(Intern)</span></div>
                        <div className="text-3xl font-black mt-2 font-mono" style={{ color: index === 0 ? 'var(--warning)' : 'var(--primary-glow)' }}>
                            {user.points} <span className="text-sm">pts</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">{user.resolvedCount} GAPs Resolved</div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 bg-surface p-4 rounded-card border border-border">
                <select className="input w-48" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
                <select className="input w-48" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                    <option value="All">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select className="input w-48" value={filterDomain} onChange={e => setFilterDomain(e.target.value)}>
                    <option value="All">All Domains</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Data Protection">Data Protection</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Gap ID</th><th>Title</th><th>Domain</th><th>Severity</th><th>Status</th><th>Assigned To</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGaps.map(g => (
                            <tr key={g.id}>
                                <td className="text-muted-foreground">{g.id}</td>
                                <td className="font-medium">{g.title}</td>
                                <td className="text-muted-foreground">{g.domain}</td>
                                <td><Badge text={g.severity} colorOpts={getSeverityColor(g.severity)} /></td>
                                <td><Badge text={g.status} colorOpts={getStatusColor(g.status)} /></td>
                                <td>{g.assignedTo} (Intern)</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn p-1.5" onClick={() => setSelectedGap(g)} title="View Detail"><Icons.Eye /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedGap && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedGap(null); }}>
                    <div className="slide-over w-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="m-0 font-bold">{selectedGap.id} Detail</h3>
                            <button className="btn p-1.5 border-none" onClick={() => setSelectedGap(null)}><Icons.Close /></button>
                        </div>
                        <h2 className="mt-0 mb-2 text-xl font-bold">{selectedGap.title}</h2>
                        <div className="flex gap-2 mb-6">
                            <Badge text={selectedGap.severity} colorOpts={getSeverityColor(selectedGap.severity)} />
                            <Badge text={selectedGap.status} colorOpts={getStatusColor(selectedGap.status)} />
                        </div>
                        <div className="text-muted-foreground mb-8 leading-relaxed">
                            {selectedGap.description}
                        </div>

                        <div className="bg-[#08080C] p-4 rounded-card border border-border flex flex-col gap-2">
                            <div className="flex justify-between"><span className="text-muted-foreground">Domain:</span> <span>{selectedGap.domain}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Assigned To:</span> <span>{selectedGap.assignedTo} (Intern)</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Created At:</span> <span>{selectedGap.createdAt}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
