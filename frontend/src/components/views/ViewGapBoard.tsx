import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { USERS } from '../../store/mockData';
import { Badge, getSeverityColor, getStatusColor } from '../Badge';
import { Icons } from '../Icons';

export const ViewGapBoard = () => {
    const { gaps, setGaps, resolveGap, assignGap } = useAppStore();

    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [filterDomain, setFilterDomain] = useState('All');

    const [showModal, setShowModal] = useState(false);
    const [selectedGap, setSelectedGap] = useState<any>(null);

    const filteredGaps = gaps.filter(g => {
        if (filterStatus !== 'All' && g.status !== filterStatus) return false;
        if (filterSeverity !== 'All' && g.severity !== filterSeverity) return false;
        if (filterDomain !== 'All' && g.domain !== filterDomain) return false;
        return true;
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const newGap = {
            id: `GAP-00${gaps.length + 1}`,
            title: fd.get('title') as string,
            domain: fd.get('domain') as string,
            status: 'open',
            severity: fd.get('severity') as string,
            assignedTo: fd.get('assignedTo') as string,
            createdAt: new Date().toISOString().split('T')[0],
            description: fd.get('description') as string
        };
        setGaps([newGap, ...gaps]);
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 font-bold text-2xl">GAP Board (CISO View)</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create GAP</button>
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
                                <td>
                                    <select
                                        className="bg-transparent border border-transparent hover:border-border rounded px-2 py-1 text-sm outline-none cursor-pointer focus:border-primary transition-colors pr-6 appearance-none"
                                        value={g.assignedTo}
                                        onChange={(e) => assignGap(g.id, e.target.value)}
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                    >
                                        <option value="Unassigned" className="bg-[#0A0A10]">Unassigned</option>
                                        {USERS.map(u => <option key={u.id} value={u.name} className="bg-[#0A0A10]">{u.name}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn p-1.5" onClick={() => setSelectedGap(g)} title="View Detail"><Icons.Eye /></button>
                                        {g.status !== 'resolved' && (
                                            <button className="btn p-1.5 text-success" onClick={() => resolveGap(g.id)} title="Mark Resolved"><Icons.Check /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal-content">
                        <h3 className="mt-0 mb-6 text-lg font-bold">Create New GAP</h3>
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground block mb-1">Title</label>
                                <input required name="title" className="input" placeholder="e.g. Missing MFA..." />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground block mb-1">Domain</label>
                                <select name="domain" className="input">
                                    <option>Access Control</option><option>Network Security</option><option>Data Protection</option><option>Endpoint Security</option><option>Incident Response</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm text-muted-foreground block mb-1">Severity</label>
                                    <select name="severity" className="input">
                                        <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm text-muted-foreground block mb-1">Assign To</label>
                                    <select name="assignedTo" className="input">
                                        {USERS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground block mb-1">Description</label>
                                <textarea required name="description" className="input" rows={3} />
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create GAP</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedGap && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedGap(null); }}>
                    <div className="slide-over w-[400px] z-[102] bg-surface h-full absolute right-0 top-0 p-6 border-l border-border shadow-2xl animate-in slide-in-from-right overflow-y-auto">
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
                            <div className="flex justify-between"><span className="text-muted-foreground">Assigned To:</span> <span>{selectedGap.assignedTo}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Created At:</span> <span>{selectedGap.createdAt}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
