
import { useAppStore } from '../../store/appStore';
import { Icons } from '../Icons';

const navItems = [
    { id: 'overview', label: 'Overview', icon: <Icons.Grid /> },
    { id: 'gap_board', label: 'GAP Board', icon: <Icons.Checklist /> },
    { id: 'ai_analysis', label: 'AI Agent Pipeline', icon: <Icons.Cpu /> },
    { id: 'gamification', label: 'GBoard', icon: <Icons.Trophy /> },
    { id: 'settings', label: 'Settings', icon: <Icons.Settings /> },
];

export const Sidebar = () => {
    const { activeView, setActiveView, logout } = useAppStore();

    return (
        <div className="w-64 bg-surface border-r border-[#1C1C2A] p-6 flex flex-col h-full sticky top-0 hidden md:flex">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-glow">
                        <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2"></polygon>
                        <polyline points="2 7 12 12 22 7"></polyline>
                        <polyline points="12 22 12 12"></polyline>
                    </svg>
                </div>
                <div className="font-mono font-bold text-xl tracking-[0.2em]">GAP<span className="text-primary-glow">LIZZER</span></div>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                    >
                        {item.icon} {item.label}
                    </div>
                ))}
            </nav>

            <div className="mt-auto border-t border-[#1C1C2A] pt-6 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="avatar">AS</div>
                    <div>
                        <div className="text-sm font-bold text-white">Alice Smith</div>
                        <div className="text-xs text-muted-foreground">CISO (Admin)</div>
                    </div>
                </div>
                <button onClick={logout} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-danger transition-colors group" title="Logout">
                    <Icons.Close />
                </button>
            </div>
        </div>
    );
};
