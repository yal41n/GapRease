
import { useAppStore } from '../../store/appStore';
import { Icons } from '../Icons';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ViewOverview = () => {
    const { gaps: activeGaps, setActiveView } = useAppStore();

    const open = activeGaps.filter(g => g.status === 'open').length;
    const inProg = activeGaps.filter(g => g.status === 'in_progress').length;
    const resolved = activeGaps.filter(g => g.status === 'resolved').length;

    const domains = Array.from(new Set(activeGaps.map(g => g.domain)));
    const domainData = domains.map(d => ({ name: d.split(' ')[0], count: activeGaps.filter(g => g.domain === d).length }));

    const statusData = [
        { name: 'Open', value: open, color: '#EF4444' },
        { name: 'In Progress', value: inProg, color: '#F59E0B' },
        { name: 'Resolved', value: resolved, color: '#10B981' }
    ].filter(d => d.value > 0);

    return (
        <div className="flex flex-col gap-6 min-h-full pb-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="m-0 text-3xl font-bold tracking-tight">System Overview</h2>
                    <p className="text-muted-foreground text-sm mt-1">Real-time telemetry and GAP analysis metrics.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-transform hover:scale-105" onClick={() => setActiveView('ai_analysis')}>
                        <Icons.Cpu /> Run AI Engine
                    </button>
                    <button className="btn bg-[#0A0A10] border-[#1C1C2A] hover:bg-[#1C1C2A] transition-colors" onClick={() => setActiveView('gap_board')}>
                        Board View
                    </button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { l: 'Total Active GAPs', v: activeGaps.length, color: 'text-primary-glow', icon: <Icons.Grid /> },
                    { l: 'Critical & Open', v: open, color: 'text-danger', icon: <Icons.Shield /> },
                    { l: 'Mitigation in Progress', v: inProg, color: 'text-warning', icon: <Icons.Cpu /> },
                    { l: 'Successfully Resolved', v: resolved, color: 'text-success', icon: <Icons.Checklist /> }
                ].map((m) => (
                    <div key={m.l} className="p-6 bg-[#08080C] border border-[#1C1C2A] rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#2D2D44] transition-colors shadow-lg">
                        <div className={`absolute -right-4 top-2 opacity-5 group-hover:opacity-10 transition-opacity transform scale-[5] ${m.color}`}>
                            {m.icon}
                        </div>
                        <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4 z-10">{m.l}</div>
                        <div className={`text-5xl font-black font-mono z-10 ${m.color}`}>{m.v}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[350px]">
                {/* Status Distribution */}
                <div className="bg-[#050508] border border-[#1C1C2A] rounded-xl p-6 flex flex-col shadow-lg">
                    <h3 className="mt-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Status Distribution</h3>
                    <div className="w-full h-[220px] relative">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0A0A10', border: '1px solid #1C1C2A', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-mono opacity-50">NO_DATA</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-5 mt-2 text-[11px] font-bold uppercase tracking-wider">
                        {statusData.map(d => (
                            <div key={d.name} className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: d.color, color: d.color }}></span>
                                <span className="text-muted-foreground">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Domain Breakdown */}
                <div className="bg-[#050508] border border-[#1C1C2A] rounded-xl p-6 flex flex-col lg:col-span-2 shadow-lg">
                    <h3 className="mt-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Domain Impact Analysis</h3>
                    <div className="w-full h-[250px] relative -ml-4">
                        {domainData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={domainData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="#333" tick={{ fill: '#8B8BAD', fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#333" tick={{ fill: '#8B8BAD', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#0A0A10', border: '1px solid #1C1C2A', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                        {domainData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={'url(#colorGlow)'} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-mono opacity-50">NO_DATA</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Terminal-style Activity Log */}
            <div className="bg-[#0A0A10] border border-[#1C1C2A] rounded-xl overflow-hidden shadow-2xl mt-2">
                <div className="bg-[#050508] p-3 border-b border-[#1C1C2A] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-danger/20 border border-danger/50"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-warning/20 border border-warning/50"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-success/20 border border-success/50"></span>
                    <span className="ml-3 font-mono text-[10px] uppercase font-bold tracking-widest text-primary-glow/70">SYSTEM_EVENT_LOG</span>
                </div>
                <div className="p-4 font-mono text-xs flex flex-col gap-1.5 h-[140px] overflow-y-auto custom-scrollbar">
                    {activeGaps.length === 0 ? (
                        <div className="text-muted-foreground italic pl-2 opacity-50"># Waiting for system events...</div>
                    ) : (
                        activeGaps.slice(0, 8).map((g, i) => {
                            const d = new Date(g.createdAt);
                            const t = `${d.getHours().toString().padStart(2, '0')}:${(d.getMinutes() + i * 5).toString().padStart(2, '0')}:${(d.getSeconds() + i * 12).toString().padStart(2, '0')}`;
                            return (
                                <div key={g.id} className="flex gap-4 hover:bg-white/5 p-1.5 rounded transition-colors group items-center">
                                    <span className="text-muted-foreground/60 w-16 shrink-0">{t}</span>
                                    <span className={`w-20 shrink-0 font-bold ${g.status === 'resolved' ? 'text-success' : g.status === 'in_progress' ? 'text-warning' : 'text-danger'}`}>
                                        [{g.status.toUpperCase()}]
                                    </span>
                                    <span className="text-white/80 truncate">
                                        GAP <span className="text-primary-glow font-bold">{g.id}</span> assigned to <span className="text-blue-400 font-bold">{g.assignedTo}</span> in <span className="text-teal-400">{g.domain}</span>
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
