import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Badge, getSeverityColor, getStatusColor } from '../Badge';
import { Icons } from '../Icons';

export const ViewOverview = () => {
    const { gaps: activeGaps, setActiveView } = useAppStore();

    const open = activeGaps.filter(g => g.status === 'open').length;
    const inProg = activeGaps.filter(g => g.status === 'in_progress').length;
    const resolved = activeGaps.filter(g => g.status === 'resolved').length;

    const domains = Array.from(new Set(activeGaps.map(g => g.domain)));
    const domainCounts = domains.map(d => ({ name: d, count: activeGaps.filter(g => g.domain === d).length }));
    const maxDomainCount = Math.max(...domainCounts.map(d => d.count)) || 1;

    return (
        <div className="flex flex-col gap-8">
            <h2 className="m-0 text-2xl font-bold">Overview</h2>

            <div className="grid grid-cols-4 gap-4">
                {[
                    { l: 'Total GAPs', v: activeGaps.length },
                    { l: 'Open', v: open },
                    { l: 'In Progress', v: inProg },
                    { l: 'Resolved', v: resolved }
                ].map(m => (
                    <div key={m.l} className="card">
                        <div className="text-muted-foreground text-sm">{m.l}</div>
                        <div className="text-3xl font-bold mt-2">{m.v}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="mt-0 text-lg font-semibold">Status Breakdown</h3>
                    <div className="flex justify-center my-8">
                        <div className="donut-chart"></div>
                    </div>
                    <div className="flex justify-around text-xs">
                        <span className="text-danger">● Open</span>
                        <span className="text-primary">● In Progress</span>
                        <span className="text-success">● Resolved</span>
                    </div>
                </div>

                <div className="card">
                    <h3 className="mt-0 text-lg font-semibold">GAPs per Domain</h3>
                    <div className="bar-chart">
                        {domainCounts.map(d => (
                            <div key={d.name} className="bar" style={{ height: `${(d.count / maxDomainCount) * 100}%` }} title={`${d.name}: ${d.count}`}>
                                <div className="bar-label">{d.name.split(' ')[0]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="mt-0 text-lg font-semibold">Quick Actions</h3>
                    <div className="flex flex-col gap-4 mt-6">
                        <button className="btn btn-primary" onClick={() => setActiveView('gap_board')}>+ Create GAP</button>
                        <button className="btn" onClick={() => setActiveView('ai_analysis')}>
                            Run AI Analysis <Icons.Cpu />
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="mt-0 text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="flex flex-col gap-4">
                    {activeGaps.slice(0, 5).map(g => (
                        <div key={g.id} className="flex justify-between border-b border-border pb-2">
                            <div><span className="text-primary">{g.assignedTo}</span> updated <b className="font-semibold">{g.id}</b> status to {g.status.replace('_', ' ')}</div>
                            <div className="text-muted-foreground text-sm">{g.createdAt}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
