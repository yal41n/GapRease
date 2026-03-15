import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Badge, getSeverityColor, getStatusColor } from '../Badge';
import { Icons } from '../Icons';

export const ViewMyGaps = () => {
    const { gaps, resolveGap } = useAppStore();
    // In a real app, this would use the logged-in user
    const myGaps = gaps.filter(g => g.assignedTo === 'Alice Smith (CISO)');

    return (
        <div className="flex flex-col gap-6">
            <h2 className="m-0 font-bold text-2xl mb-4">My Assigned GAPs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGaps.map(g => (
                    <div key={g.id} className="card flex flex-col gap-4 border-l-4" style={{ borderLeftColor: getSeverityColor(g.severity).color }}>
                        <div className="flex justify-between items-start">
                            <span className="text-muted-foreground font-mono text-sm">{g.id}</span>
                            <Badge text={g.status} colorOpts={getStatusColor(g.status)} />
                        </div>
                        <h3 className="m-0 font-bold text-lg">{g.title}</h3>
                        <p className="text-muted-foreground text-sm flex-1">{g.description}</p>
                        <div className="flex justify-between items-end mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                            <span className="text-xs text-muted-foreground">{g.domain}</span>
                            {g.status !== 'resolved' && (
                                <button className="btn btn-primary px-3 py-1 text-xs" onClick={() => resolveGap(g.id)}>
                                    Mark Resolved <Icons.Check />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {myGaps.length === 0 && (
                <div className="text-muted-foreground text-center p-12 card border-dashed border-2">
                    <Icons.Checklist />
                    <p className="mt-4">You have no assigned GAPs to resolve.</p>
                </div>
            )}
        </div>
    );
};
