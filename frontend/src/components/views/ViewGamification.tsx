import React from 'react';
import { LEADERBOARD } from '../../store/mockData';
import { Icons } from '../Icons';

export const ViewGamification = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="m-0 font-bold text-2xl mb-2">Team Benchmark</h2>
                    <div className="text-muted-foreground">Top performers in GAP resolution.</div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-primary-glow">840</div>
                    <div className="text-sm text-muted-foreground tracking-wider uppercase">Your Score</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="card">
                    <h3 className="mt-0 text-lg font-semibold flex items-center gap-2 text-warning mb-6">
                        <Icons.Trophy /> Global Leaderboard
                    </h3>
                    <div className="flex flex-col gap-4">
                        {LEADERBOARD.map((u, i) => (
                            <div key={u.name} className="flex items-center justify-between p-3 rounded-card bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(124,58,237,0.05)] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 text-center font-bold ${i === 0 ? 'text-warning text-xl' : i === 1 ? 'text-[#94A3B8] text-lg' : i === 2 ? 'text-[#B45309] text-lg' : 'text-muted-foreground'}`}>
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{u.name}</div>
                                        <div className="text-xs text-muted-foreground">{u.unit}</div>
                                    </div>
                                </div>
                                <div className="font-mono text-primary-glow font-bold">{u.score} pts</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, var(--surface) 0%, #0A0A10 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div>
                        <h3 className="mt-0 text-lg font-semibold mb-2">Current Sprint: "Zero Trust Push"</h3>
                        <p className="text-muted-foreground text-sm">Resolve 10 Identity-related GAPs this month to earn the IAM badge.</p>

                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-primary-glow">Progress: 6/10</span>
                                <span>60%</span>
                            </div>
                            <div className="w-full h-2 bg-[#08080C] rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
